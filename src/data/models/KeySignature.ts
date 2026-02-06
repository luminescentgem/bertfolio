import { NoteSpelling, NoteSpellingView } from "./NoteSpelling"

function rotateLeft<T>(arr: T[], k: number): T[] {
  const n = arr.length
  const s = ((k % n) + n) % n; // normalize
  return arr.slice(s).concat(arr.slice(0, s))
}

type SpelledTonic = string
function spellingKey(nsv: NoteSpellingView): SpelledTonic {
    return `${nsv.letter}${nsv.accidental}`
}

enum AccidentalPreference {
    Sharp, Flat, Neutral
}

const ACCIDENTAL_PREFERENCE_FOR_MAJOR: Record<SpelledTonic, AccidentalPreference> = {
  // C
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Natural })]: AccidentalPreference.Neutral,
  [spellingKey({ letter: NoteLetter.C, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // D
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Natural })]: AccidentalPreference.Sharp,
  [spellingKey({ letter: NoteLetter.D, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // E
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Natural })]: AccidentalPreference.Sharp,
  [spellingKey({ letter: NoteLetter.E, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // F
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Natural })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.F, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // G
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Natural })]: AccidentalPreference.Sharp,
  [spellingKey({ letter: NoteLetter.G, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // A
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Natural })]: AccidentalPreference.Sharp,
  [spellingKey({ letter: NoteLetter.A, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,

  // B
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Flat })]: AccidentalPreference.Flat,
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Natural })]: AccidentalPreference.Sharp,
  [spellingKey({ letter: NoteLetter.B, accidental: Accidental.Sharp })]: AccidentalPreference.Sharp,
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
    private defaultAccidental: AccidentalPreference

    constructor(
        private tonic: NoteSpelling = new NoteSpelling(0),
        private mode: Mode = Mode.Major
    ) {
        this.defaultAccidental = this.computeAccidental(tonic, mode)
    }

    public getTonic(): NoteSpelling {
        return this.tonic
    }

    public getMode(): Mode {
        return this.mode
    }

    public getAccidentalPreference(): AccidentalPreference {
        return this.defaultAccidental
    }

    public alignEnharmonic(noteSpelling: NoteSpelling): NoteSpellingView {
        switch (this.defaultAccidental) {
            case AccidentalPreference.Flat:
                return noteSpelling.format(Accidental.Flat)
            case AccidentalPreference.Sharp:
                return noteSpelling.format(Accidental.Sharp)
            case AccidentalPreference.Neutral:
                return noteSpelling.format(Accidental.Flat)
        }
    }

    private computeAccidental(tonic: NoteSpelling, mode: Mode): AccidentalPreference {
        const offset = (tonic.value + MODE_OFFSETS[mode]) % 12
        const noteSpellingSubstitute = new NoteSpelling(offset)
        const spelledTonic = spellingKey(noteSpellingSubstitute.format())
        return ACCIDENTAL_PREFERENCE_FOR_MAJOR[spelledTonic]
    }
}