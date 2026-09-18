import webpush from 'web-push'

let configurado = false

function garantirConfiguracao() {
  if (configurado) return
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT

  if (!publicKey || !privateKey || !subject) {
    throw new Error(
      'Chaves VAPID em falta — define VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY e VAPID_SUBJECT (ver .env.example).'
    )
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  configurado = true
}

export async function enviarPush(
  subscricao: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { titulo: string; corpo: string; url?: string }
) {
  garantirConfiguracao()
  await webpush.sendNotification(subscricao, JSON.stringify(payload))
}
