'use client'

import { useEffect, useState } from 'react'

function base64UrlParaUint8Array(base64Url: string) {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4)
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export function ActivarNotificacoes() {
  const [estado, setEstado] = useState<'indisponivel' | 'inactivo' | 'activo'>('inactivo')
  const [aProcessar, setAProcessar] = useState(false)

  useEffect(() => {
    let cancelado = false

    async function verificarSuporte() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (!cancelado) setEstado('indisponivel')
        return
      }
      const registo = await navigator.serviceWorker.register('/sw.js')
      const subscricaoExistente = await registo.pushManager.getSubscription()
      if (!cancelado && subscricaoExistente) setEstado('activo')
    }

    verificarSuporte()
    return () => {
      cancelado = true
    }
  }, [])

  async function activar() {
    setAProcessar(true)
    try {
      const permissao = await Notification.requestPermission()
      if (permissao !== 'granted') {
        setEstado('inactivo')
        return
      }

      const registo = await navigator.serviceWorker.ready
      const chavePublica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!chavePublica) {
        setEstado('indisponivel')
        return
      }

      const subscricao = await registo.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlParaUint8Array(chavePublica),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscricao.toJSON()),
      })

      setEstado('activo')
    } catch {
      setEstado('inactivo')
    } finally {
      setAProcessar(false)
    }
  }

  async function desactivar() {
    setAProcessar(true)
    try {
      const registo = await navigator.serviceWorker.ready
      const subscricao = await registo.pushManager.getSubscription()
      if (subscricao) {
        await subscricao.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscricao.endpoint }),
        })
      }
      setEstado('inactivo')
    } finally {
      setAProcessar(false)
    }
  }

  if (estado === 'indisponivel') {
    return (
      <p className="text-sm text-neutral-500">
        Este dispositivo/browser não suporta notificações push. Em iOS, adiciona primeiro a app
        ao ecrã principal.
      </p>
    )
  }

  if (estado === 'activo') {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-ride-green-dark">Notificações activas ✓</p>
        <button
          onClick={desactivar}
          disabled={aProcessar}
          className="text-sm text-neutral-500 underline hover:text-ride-red disabled:opacity-50"
        >
          {aProcessar ? 'A desactivar…' : 'Desactivar'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={activar}
      disabled={aProcessar}
      className="rounded border border-ride-green px-3 py-2 text-sm text-ride-green transition hover:bg-ride-green hover:text-white disabled:opacity-50"
    >
      {aProcessar ? 'A activar…' : 'Activar notificações'}
    </button>
  )
}
