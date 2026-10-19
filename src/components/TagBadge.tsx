import { tagStyle } from '../data/tags'

interface TagBadgeProps {
  tag: string
  muted?: boolean
}

export default function TagBadge({ tag, muted = false }: TagBadgeProps) {
  const style = tagStyle(tag)

  return (
    <span
      className={`chamfer-sm inline-flex h-[23px] shrink-0 items-center gap-0.5 border px-1.5 font-mono text-[12px] tracking-[0.02em] ${style.border} ${style.background} ${style.text} ${
        muted ? 'opacity-45 saturate-50' : ''
      }`}
    >
      <span className="opacity-55">#</span>
      {tag}
    </span>
  )
}
