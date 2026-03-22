import { Accidental } from "../enums/Accidental"
import { NoteLetter } from "../enums/NoteLetter"

export type NoteSpellingDTO = { letter: NoteLetter, accidental: Accidental }

const TUNE_HALFTONE_VALUES: Record<NoteLetter, number> = {
  [NoteLetter.C]: 0,
  [NoteLetter.D]: 2,
  [NoteLetter.E]: 4,
  [NoteLetter.F]: 5,
  [NoteLetter.G]: 7,
  [NoteLetter.A]: 9,
  [NoteLetter.B]: 11,
}

// Reverse map for naturals only (0,2,4,5,7,9,11).
const HALFTONE_VALUE_TUNES: Record<number, NoteLetter> =
  (Object.entries(TUNE_HALFTONE_VALUES) as unknown as Array<[NoteLetter, number]>)
    .reduce((acc, [k, v]) => {
      acc[v] = k
      return acc
    }, {} as Record<number, NoteLetter>)

const ALTERATION_VALUES: Record<Accidental, number> = {
  [Accidental.Flat]: -1,
  [Accidental.Natural]: 0,
  [Accidental.Sharp]: 1
}

export class NoteSpelling {
  // internal = pitch class 0..11
  public value: number

  constructor(value: number) {
    this.value = ((value % 12) + 12) % 12
  }

  public static letterValue(letter: NoteLetter): number {
    return TUNE_HALFTONE_VALUES[letter]
  }

  public static accidentalValue(accidental: Accidental): number {
    return ALTERATION_VALUES[accidental]
  }

  public static viewValue(nsv: NoteSpellingDTO): number {
    return NoteSpelling.letterValue(nsv.letter) +
           NoteSpelling.accidentalValue(nsv.accidental)
  }

  public format(altPref: Accidental = Accidental.Sharp): NoteSpellingDTO {
    const pc = this.value

    // 1) Natural via direct table
    const naturalTune = HALFTONE_VALUE_TUNES[pc]
    if (naturalTune !== undefined) {
      return { letter: naturalTune, accidental: Accidental.Natural }
    }

    // 2) Build ordered candidate list: preferred first, then the rest
    const allAlts = [Accidental.Sharp, Accidental.Flat, Accidental.Natural]
    const candidates = [
      altPref,
      ...allAlts.filter(a => a !== altPref),
    ].filter(a => a !== Accidental.Natural) // natural already failed above

    // 3) Try them in order
    for (const alt of candidates) {
      const shift = NoteSpelling.accidentalValue(alt)
      const basePc = ((pc - shift) % 12 + 12) % 12
      const t = HALFTONE_VALUE_TUNES[basePc]
      if (t !== undefined) {
        return { letter: t, accidental: alt }
      }
    }

    throw new Error(`NoteSpelling.format: cannot map pitch class=${pc}`)
  }

  public static fromView(nsv: NoteSpellingDTO): NoteSpelling {
    return new NoteSpelling(NoteSpelling.viewValue(nsv))
  }
}