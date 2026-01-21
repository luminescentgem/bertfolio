type NoteSpelling = object & { letter: NoteLetter, accidental: Accidental, octave: number }

const TUNE_HALFTONE_VALUES: Record<NoteLetter, number> = {
    [NoteLetter.C]: 0,
    [NoteLetter.D]: 2,
    [NoteLetter.E]: 4,
    [NoteLetter.F]: 5,
    [NoteLetter.G]: 7,
    [NoteLetter.A]: 9,
    [NoteLetter.B]: 11,
}

const HALFTONE_VALUE_TUNES: Record<number, NoteLetter> =
  Object.fromEntries(
    Object.entries(TUNE_HALFTONE_VALUES).map(([k, v]) => [v, k])
  ) as Record<number, NoteLetter>;

const ALTERATION_VALUES: Record<Accidental, number> = {
    [Accidental.Flat]: -1,
    [Accidental.Natural]: 0,
    [Accidental.Sharp]: 1
}

const VALUE_ALTERATIONS: Record<number, NoteLetter> =
  Object.fromEntries(
    Object.entries(ALTERATION_VALUES).map(([k, v]) => [v, k])
  ) as Record<number, NoteLetter>;

export default class Pitch { 
    constructor(public value: number) {}

    public static fromNoteSpelling(noteSpelling: NoteSpelling) {
        return new Pitch(
            Pitch.letterValue(noteSpelling.letter)
          + Pitch.accidentalValue(noteSpelling.accidental)
          + Pitch.octaveValue(noteSpelling.octave)
        )
    }

    public toNoteSpelling(altPref: Accidental = Accidental.Sharp): NoteSpelling {
        const octave = Math.floor(this.value / 8);
        const letterAccidental = this.value % 8;

        // 1) Natural via direct table
        const naturalTune = HALFTONE_VALUE_TUNES[letterAccidental];
        if (naturalTune) {
            return { letter: naturalTune, accidental: Accidental.Natural, octave };
        }

        // 2) Build ordered candidate list: preferred first, then the rest
        const allAlts = [Accidental.Sharp, Accidental.Flat, Accidental.Natural];
        const candidates = [
            altPref,
            ...allAlts.filter(a => a !== altPref),
        ];

        // 3) Try them in order
        for (const alt of candidates) {
            const shift = Pitch.accidentalValue(alt);
            const t = HALFTONE_VALUE_TUNES[letterAccidental + shift];
            if (t) {
                return { letter: t, accidental: alt, octave };
            }
        }

        // Otherwise...
        throw new Error(
            `toNoteSpelling: cannot map pitch value=${this.value} (octave=${octave}, mod=${letterAccidental})`
        );
    }

    public toString(altPref: Accidental|null = null) {
        const noteSpelling = altPref ? this.toNoteSpelling(altPref) : this.toNoteSpelling()
        return noteSpelling.letter + noteSpelling.accidental + noteSpelling.octave
    }

    public static letterValue(letter: NoteLetter): number {
        return TUNE_HALFTONE_VALUES[letter]
    }

    public static accidentalValue(accidental: Accidental): number {
        return ALTERATION_VALUES[accidental]
    }

    public static octaveValue(octave: number): number {
        return octave * 8
    }
}