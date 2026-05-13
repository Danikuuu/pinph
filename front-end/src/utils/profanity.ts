/**
 * Word lists for display-time filtering (English + Filipino).
 * Extend BAD_WORDS as needed; matching is case-insensitive per token.
 */
const BAD_WORDS = new Set<string>([
  // English
  'arse',
  'arsehole',
  'ass',
  'asshole',
  'bastard',
  'bitch',
  'bloody',
  'bollocks',
  'bullshit',
  'cock',
  'crap',
  'cum',
  'cunt',
  'damn',
  'dick',
  'dickhead',
  'dyke',
  'fag',
  'faggot',
  'fuck',
  'fucked',
  'fucker',
  'fucking',
  'fuk',
  'hell',
  'hoe',
  'homo',
  'jerk',
  'kike',
  'motherfucker',
  'nazi',
  'nigger',
  'nigga',
  'penis',
  'piss',
  'prick',
  'pussy',
  'retard',
  'retarded',
  'scrotum',
  'shit',
  'shithead',
  'slut',
  'spic',
  'spunk',
  'tit',
  'tits',
  'twat',
  'wank',
  'wanker',
  'whore',
  // Filipino / Tagalog & common mixes
  'bobo',
  'bubu',
  'burat',
  'bwisit',
  'bwiset',
  'chupa',
  'engot',
  'etits',
  'gaga',
  'gago',
  'hayop',
  'hindot',
  'hinayupak',
  'inutil',
  'iyot',
  'kantot',
  'kupal',
  'leche',
  'lintik',
  'pakyu',
  'peks',
  'pekpek',
  'pesteng',
  'pota',
  'potang',
  'puta',
  'putang',
  'putangina',
  'putanginamo',
  'punyeta',
  'salot',
  'shet',
  'siraulo',
  'supot',
  'tanga',
  'tangina',
  'tarado',
  'tarantado',
  'titi',
  'ulol',
  'ungoy',
  'yawa',
])

export interface ProfanitySegment {
  text: string
  blur: boolean
}

/** Split visible text into segments; whole-token match against BAD_WORDS (strips outer punctuation). */
export function segmentProfanity(text: string): ProfanitySegment[] {
  const out: ProfanitySegment[] = []
  if (!text) return out

  const re = /(\s+)|([^\s]+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m[1]) {
      out.push({ text: m[1], blur: false })
      continue
    }
    const token = m[2] ?? ''
    const core = token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    const lower = core.toLowerCase()
    const blur = lower.length > 0 && BAD_WORDS.has(lower)
    out.push({ text: token, blur })
  }
  return out
}
