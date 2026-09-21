import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

// Cliente com a chave "service_role" — ignora RLS. Só pode ser usado em código
// de servidor (nunca importado por um Client Component) e apenas quando a
// operação precisa de aceder a dados de outros utilizadores (ex.: notificar
// todos os destinatários elegíveis de um novo passeio).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY em falta — necessária para operações que acedem a dados de outros utilizadores (ver .env.example).'
    )
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
