import { NoteSpelling, NoteSpellingDTO } from "./NoteSpelling"
import { NoteLetter } from "../enums/NoteLetter";
import { Accidental } from "../enums/Accidental";
import { Mode } from "../enums/Mode";

function rotateLeft<T>(arr: T[], k: number): T[] {
  const n = arr.length
  const s = ((k % n) + n) % n; // normalize
  return arr.slice(s).concat(arr.slice(0, s))
}

type SpelledTonic = string
function spellingKey(nsv: NoteSpellingDTO): SpelledTonic {
    return `${nsv.letter}${nsv.accidental}`
}

enum EnharmonicBias {
    PreferSharps, PreferFlats, NoBias
}

const ACCIDENTAL_PREFERENCE_FOR_MAJOR: Record<SpelledTonic, EnharmonicBias> = {
  // C
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Natural })]: EnharmonicBias.NoBias,
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // D
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Natural })]: EnharmonicBias.PreferSharps,
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // E
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Natural })]: EnharmonicBias.PreferSharps,
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // F
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Natural })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // G
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Natural })]: EnharmonicBias.PreferSharps,
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // A
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Natural })]: EnharmonicBias.PreferSharps,
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,

  // B
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Flat })]: EnharmonicBias.PreferFlats,
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Natural })]: EnharmonicBias.PreferSharps,
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Sharp })]: EnharmonicBias.PreferSharps,
}

const MODE_OFFSETS: Record<Mode, number> = {
    [Mode.Ionian]: 0,
    [Mode.Dorian]: 2,
    [Mode.Phrygian]: 4,
    [Mode.Lydian]: 5,
    [Mode.Mixolydian]: 7,
    [Mode.Aeolian]: 9,
    [Mode.Locrian]: 11,
}

export default class KeySignature {
    private defaultAccidental: EnharmonicBias

    constructor(
        private tonic: NoteSpellingDTO = 
            { letter: NoteLetter.C, accidental: Accidental.Natural },
        private mode: Mode = Mode.Major
    ) {
        this.defaultAccidental = this.computeAccidental(tonic, mode)
    }

    public getTonic(): NoteSpellingDTO {
        return this.tonic
    }

    public getMode(): Mode {
        return this.mode
    }

    public getAccidentalPreference(): EnharmonicBias {
        return this.defaultAccidental
    }

    public alignEnharmonic(noteSpelling: NoteSpelling): NoteSpellingDTO {
        switch (this.defaultAccidental) {
            case EnharmonicBias.PreferFlats:
                return noteSpelling.format(Accidental.Flat)
            case EnharmonicBias.PreferSharps:
                return noteSpelling.format(Accidental.Sharp)
            case EnharmonicBias.NoBias:
                return noteSpelling.format()
        }
    }

    private computeAccidental(tonic: NoteSpellingDTO, mode: Mode): EnharmonicBias {
        const offset = ((NoteSpelling.viewValue(tonic) - MODE_OFFSETS[mode]) % 12 + 12) % 12
        const majorTonic = new NoteSpelling(offset)
        const spelledTonic = spellingKey(majorTonic.format(
            tonic.accidental === Accidental.Flat ? Accidental.Flat : Accidental.Sharp
        ))
        return ACCIDENTAL_PREFERENCE_FOR_MAJOR[spelledTonic]
    }
}
