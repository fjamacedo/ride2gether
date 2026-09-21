'use client'

import { useRouter } from 'next/navigation'

export function BotaoVoltar() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-4 left-4 z-20 flex items-center gap-1 rounded-full bg-ride-black/90 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur transition hover:bg-ride-black"
    >
      ← Voltar
    </button>
  )
}
