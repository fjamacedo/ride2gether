export function Logo({
  tamanho = 'md',
  claro = false,
}: {
  tamanho?: 'sm' | 'md' | 'lg'
  /** true = para usar sobre fundo escuro (texto claro); false = sobre fundo claro (texto escuro) */
  claro?: boolean
}) {
  const tamanhos = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl sm:text-5xl',
  }

  return (
    <span
      className={`font-extrabold tracking-tight ${tamanhos[tamanho]} ${claro ? 'text-white' : 'text-neutral-900'}`}
    >
      RIDE<span className="text-ride-gold">2</span>GETHER
    </span>
  )
}

export function Tagline({ claro = false }: { claro?: boolean }) {
  return (
    <p className={`text-sm tracking-wide ${claro ? 'text-neutral-300' : 'text-neutral-500'}`}>
      Passeios <span className="text-ride-green">•</span> Amigos{' '}
      <span className="text-ride-red">•</span> Estradas{' '}
      <span className="text-ride-green">•</span> Memórias
    </p>
  )
}
