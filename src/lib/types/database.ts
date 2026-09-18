// Tipos manuais, alinhados com supabase/migrations/0001_init.sql.
// Substituir por `npx supabase gen types typescript` assim que o projecto
// Supabase estiver criado, para os tipos ficarem gerados a partir do schema real.

export type TipoPerfil = 'direccao_clube' | 'socio' | 'independente'
export type EstadoMembro = 'activo' | 'inactivo'
export type AmbitoVisibilidade =
  | 'privado'
  | 'distrital'
  | 'regional'
  | 'nacional'
  | 'internacional'
  | 'publico'
export type EstadoInscricao = 'inscrito' | 'confirmado'

// Nota: usar `type` em TODOS estes tipos (nunca `interface`) — com a versão
// instalada do @supabase/supabase-js (2.116), passar um tipo Row/Insert/Update
// declarado com `interface` faz o TypeScript desistir silenciosamente da
// inferência genérica em `.from()`/`.select()`, colapsando tudo para `never`
// SEM reportar erro (confirmado por reprodução isolada: com `interface`,
// `.from('tabela_que_nao_existe')` nem sequer acusava erro). `type` resolve.

export type Perfil = {
  id: string
  nome: string
  contacto: string | null
  nif: string | null
  tipo_perfil: TipoPerfil
  created_at: string
}

export type Mota = {
  id: string
  utilizador_id: string
  marca: string
  modelo: string | null
  ano: number | null
  cilindrada_cc: number | null
  created_at: string
}

export type Clube = {
  id: string
  nome: string
  localizacao: string | null
  nif: string
  responsavel_id: string
  data_registo: string
}

export type ClubeMembro = {
  clube_id: string
  utilizador_id: string
  estado: EstadoMembro
  data_adesao: string
}

export type Passeio = {
  id: string
  organizador_clube_id: string | null
  organizador_utilizador_id: string | null
  titulo: string
  data: string
  local: string
  descricao: string | null
  rota: string | null
  ambito_visibilidade: AmbitoVisibilidade
  max_participantes: number | null
  cilindrada_min: number | null
  cilindrada_max: number | null
  marca: string | null
  created_at: string
}

export type Inscricao = {
  id: string
  passeio_id: string
  utilizador_id: string
  estado: EstadoInscricao
  created_at: string
}

export type PushSubscriptionRow = {
  id: string
  utilizador_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13'
  }
  public: {
    Tables: {
      perfis: {
        Row: Perfil
        Insert: Partial<Perfil> & { id: string }
        Update: Partial<Perfil>
        Relationships: []
      }
      clubes: {
        Row: Clube
        Insert: Partial<Clube>
        Update: Partial<Clube>
        Relationships: []
      }
      clube_membros: {
        Row: ClubeMembro
        Insert: Partial<ClubeMembro>
        Update: Partial<ClubeMembro>
        Relationships: []
      }
      passeios: {
        Row: Passeio
        Insert: Partial<Passeio>
        Update: Partial<Passeio>
        Relationships: []
      }
      inscricoes: {
        Row: Inscricao
        Insert: Partial<Inscricao>
        Update: Partial<Inscricao>
        Relationships: []
      }
      push_subscriptions: {
        Row: PushSubscriptionRow
        Insert: Partial<PushSubscriptionRow>
        Update: Partial<PushSubscriptionRow>
        Relationships: []
      }
      motas: {
        Row: Mota
        Insert: Partial<Mota> & { utilizador_id: string; marca: string }
        Update: Partial<Mota>
        Relationships: []
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- {} (não Record<string, never>) é necessário aqui; ver nota acima
    Views: {}
    Functions: {
      procurar_perfil_por_email: {
        Args: { p_email: string }
        Returns: { id: string; nome: string }[]
      }
      e_membro_activo: {
        Args: { p_clube_id: string; p_utilizador_id: string }
        Returns: boolean
      }
      dirige_clube: {
        Args: { p_clube_id: string; p_utilizador_id: string }
        Returns: boolean
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- {} (não Record<string, never>) é necessário aqui; ver nota acima
    Enums: {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- {} (não Record<string, never>) é necessário aqui; ver nota acima
    CompositeTypes: {}
  }
}
