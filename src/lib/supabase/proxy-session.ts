import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database'

// Next.js 16 renomeou o ficheiro/função "middleware" para "proxy"; a função
// mantém o mesmo papel: refrescar a sessão Supabase em cada pedido.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rotaPublica =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/registo') ||
    request.nextUrl.pathname.startsWith('/recuperar-password') ||
    request.nextUrl.pathname.startsWith('/auth/confirm') ||
    // /redefinir-password tem de ficar acessível sem sessão "visível" ao
    // proxy: a sessão de recuperação chega num fragmento (#access_token=...)
    // da URL, que o browser nunca envia ao servidor — só o JS do lado do
    // cliente a consegue processar depois da página carregar.
    request.nextUrl.pathname.startsWith('/redefinir-password') ||
    request.nextUrl.pathname.startsWith('/termos') ||
    request.nextUrl.pathname.startsWith('/privacidade') ||
    request.nextUrl.pathname === '/'

  if (!user && !rotaPublica) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}
