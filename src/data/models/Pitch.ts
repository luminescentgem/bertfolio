import { Accidental } from "../enums/Accidental"
import { NoteSpelling, NoteSpellingDTO } from "./NoteSpelling"

export type PitchSpelling = NoteSpellingDTO & { octave: number }

export class Pitch {
  constructor(public value: number) {}

  public static fromPitchSpelling(ps: PitchSpelling) {
    return new Pitch(
      NoteSpelling.letterValue(ps.letter)
      + NoteSpelling.accidentalValue(ps.accidental)
      + Pitch.octaveValue(ps.octave)
    )
  }

  public octave(): number {
    return Math.floor(this.value / 12)
  }

  public pitchClass(): NoteSpelling {
    return new NoteSpelling(this.value)
  }

  public toPitchSpelling(altPref: Accidental = Accidental.Sharp): PitchSpelling {
    const octave = this.octave()
    const { letter, accidental } = this.pitchClass().format(altPref)
    return { letter, accidental, octave }
  }

  public toString(altPref: Accidental | null = null) {
    const ps = altPref ? this.toPitchSpelling(altPref) : this.toPitchSpelling()
    return ps.letter + ps.accidental + ps.octave
  }

  public static octaveValue(octave: number): number {
    return octave * 12
  }
}
