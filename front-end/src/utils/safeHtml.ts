import { segmentProfanity } from './profanity'

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Safe HTML string for Leaflet popups: escaped + blurred profanity spans. */
export function htmlWithProfanityBlur(text: string): string {
  const segments = segmentProfanity(text ?? '')
  return segments
    .map((seg) => {
      const esc = escapeHtml(seg.text)
      return seg.blur
        ? `<span style="filter:blur(5px);display:inline-block;max-width:100%;" title="Filtered">${esc}</span>`
        : esc
    })
    .join('')
}
