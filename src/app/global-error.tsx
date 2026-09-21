'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-PT">
      <body className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Ocorreu um erro</h1>
        <p className="text-sm text-neutral-600">
          Algo correu mal. Já fomos avisados automaticamente — tenta actualizar a página.
        </p>
      </body>
    </html>
  )
}
