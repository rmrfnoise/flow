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
