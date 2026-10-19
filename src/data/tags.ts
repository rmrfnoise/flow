type TagTone = 'lime' | 'cyan' | 'magenta' | 'amber' | 'violet'

interface TagStyle {
  border: string
  background: string
  text: string
  active: string
}

const TAG_STYLES: Record<TagTone, TagStyle> = {
  lime: {
    border: 'border-[var(--accent-line)]',
    background: 'bg-[var(--accent-surface)]',
    text: 'text-[var(--accent-ink)]',
    active:
      'border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-ink)] shadow-[0_0_16px_var(--accent-glow-soft)]',
  },
  cyan: {
    border: 'border-[var(--tag-cyan-border)]',
    background: 'bg-[var(--tag-cyan-bg)]',
    text: 'text-[var(--tag-cyan-text)]',
    active:
      'border-[var(--tag-cyan-active-border)] bg-[var(--tag-cyan-active-bg)] text-[var(--tag-cyan-active-text)] shadow-[0_0_16px_var(--tag-cyan-glow)]',
  },
  magenta: {
    border: 'border-[var(--tag-magenta-border)]',
    background: 'bg-[var(--tag-magenta-bg)]',
    text: 'text-[var(--tag-magenta-text)]',
    active:
      'border-[var(--tag-magenta-active-border)] bg-[var(--tag-magenta-active-bg)] text-[var(--tag-magenta-active-text)] shadow-[0_0_16px_var(--tag-magenta-glow)]',
  },
  amber: {
    border: 'border-[var(--tag-amber-border)]',
    background: 'bg-[var(--tag-amber-bg)]',
    text: 'text-[var(--tag-amber-text)]',
    active:
      'border-[var(--tag-amber-active-border)] bg-[var(--tag-amber-active-bg)] text-[var(--tag-amber-active-text)] shadow-[0_0_16px_var(--tag-amber-glow)]',
  },
  violet: {
    border: 'border-[var(--tag-violet-border)]',
    background: 'bg-[var(--tag-violet-bg)]',
    text: 'text-[var(--tag-violet-text)]',
    active:
      'border-[var(--tag-violet-active-border)] bg-[var(--tag-violet-active-bg)] text-[var(--tag-violet-active-text)] shadow-[0_0_16px_var(--tag-violet-glow)]',
  },
}

const TAG_TONES = Object.keys(TAG_STYLES) as TagTone[]

const TAG_PATTERN = /#([\p{L}\p{N}][\p{L}\p{N}_-]{0,23})/gu

export function parseHashtags(text: string) {
  const tags: string[] = []
  const seen = new Set<string>()

  for (const match of text.matchAll(TAG_PATTERN)) {
    const tag = match[1].toLocaleLowerCase()
    if (!tag || seen.has(tag)) continue
    seen.add(tag)
    tags.push(tag)
    if (tags.length >= 8) break
  }

  return tags
}

export function stripHashtags(text: string) {
  return text
    .replace(TAG_PATTERN, ' ')
    .replace(/[ \t]+([、，,;；:：])/gu, '$1')
    .replace(/[ \t]+/gu, ' ')
    .replace(/^[\s、，,;；:：]+/u, '')
    .replace(/[\s、，,;；:：]+$/u, '')
    .trim()
}

function tagTone(tag: string): TagTone {
  let hash = 0
  for (const char of tag) {
    hash = (hash * 31 + char.codePointAt(0)!) % 997
  }
  return TAG_TONES[hash % TAG_TONES.length]
}

export function tagStyle(tag: string) {
  return TAG_STYLES[tagTone(tag)]
}
