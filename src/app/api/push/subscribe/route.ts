import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ erro: 'Sessão expirada' }, { status: 401 })
  }

  const subscricao = await request.json()
  const { endpoint, keys } = subscricao as { endpoint: string; keys: { p256dh: string; auth: string } }

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ erro: 'Subscrição inválida' }, { status: 400 })
  }

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      utilizador_id: user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    { onConflict: 'endpoint' }
  )

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ erro: 'Sessão expirada' }, { status: 401 })
  }

  const { endpoint } = (await request.json()) as { endpoint: string }
  await supabase
    .from('push_subscriptions')
    .delete()
    .eq('utilizador_id', user.id)
    .eq('endpoint', endpoint)

  return NextResponse.json({ ok: true })
}
