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

export interface Perfil {
  id: string
  nome: string
  contacto: string | null
  nif: string | null
  tipo_perfil: TipoPerfil
  cilindrada_cc: number | null
  marca_moto: string | null
  created_at: string
}

export interface Clube {
  id: string
  nome: string
  localizacao: string | null
  nif: string
  responsavel_id: string
  data_registo: string
}

export interface ClubeMembro {
  clube_id: string
  utilizador_id: string
  estado: EstadoMembro
  data_adesao: string
}

export interface Passeio {
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

export interface Inscricao {
  id: string
  passeio_id: string
  utilizador_id: string
  estado: EstadoInscricao
  created_at: string
}

export interface PushSubscriptionRow {
  id: string
  utilizador_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      perfis: { Row: Perfil; Insert: Partial<Perfil> & { id: string }; Update: Partial<Perfil> }
      clubes: { Row: Clube; Insert: Partial<Clube>; Update: Partial<Clube> }
      clube_membros: {
        Row: ClubeMembro
        Insert: Partial<ClubeMembro>
        Update: Partial<ClubeMembro>
      }
      passeios: { Row: Passeio; Insert: Partial<Passeio>; Update: Partial<Passeio> }
      inscricoes: { Row: Inscricao; Insert: Partial<Inscricao>; Update: Partial<Inscricao> }
      push_subscriptions: {
        Row: PushSubscriptionRow
        Insert: Partial<PushSubscriptionRow>
        Update: Partial<PushSubscriptionRow>
      }
    }
  }
}
