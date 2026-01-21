export type NoteSpelling = object & { letter: NoteLetter, accidental: Accidental }
export type PitchSpelling = NoteSpelling & { octave: number }

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
        }, {} as Record<number, NoteLetter>);

const ALTERATION_VALUES: Record<Accidental, number> = {
    [Accidental.Flat]: -1,
    [Accidental.Natural]: 0,
    [Accidental.Sharp]: 1
}

export class Pitch {
    constructor(public value: number) { }

    public static fromNoteSpelling(noteSpelling: PitchSpelling) {
        return new Pitch(
            Pitch.letterValue(noteSpelling.letter)
            + Pitch.accidentalValue(noteSpelling.accidental)
            + Pitch.octaveValue(noteSpelling.octave)
        )
    }

    public octave(): number {
        return Math.floor(this.value / 12);
    }

    public toPitchClassSpelling(altPref: Accidental = Accidental.Sharp): NoteSpelling {
        const pitchClass = ((this.value % 12) + 12) % 12;

        // 1) Natural via direct table
        const naturalTune = HALFTONE_VALUE_TUNES[pitchClass];
        if (naturalTune !== undefined) {
            return { letter: naturalTune, accidental: Accidental.Natural };
        }

        // 2) Build ordered candidate list: preferred first, then the rest
        const allAlts = [Accidental.Sharp, Accidental.Flat, Accidental.Natural];
        const candidates = [
            altPref,
            ...allAlts.filter(a => a !== altPref),
        ].filter(a => a !== Accidental.Natural); // natural already failed above

        // 3) Try them in order
        for (const alt of candidates) {
            const shift = Pitch.accidentalValue(alt);
            // Natural base letter such that base + shift == pitch class
            const basePitchClass = ((pitchClass - shift) % 12 + 12) % 12;
            const t = HALFTONE_VALUE_TUNES[basePitchClass];
            if (t !== undefined) {
                return { letter: t, accidental: alt };
            }
        }

        // Otherwise...
        throw new Error("toPitchClassSpelling: cannot map"
            + `pitch value=${this.value} (pitch class=${pitchClass})`);
    }

    public toPitchSpelling(altPref: Accidental = Accidental.Sharp): PitchSpelling {
        const octave = this.octave();
        const { letter, accidental } = this.toPitchClassSpelling(altPref);
        return { letter, accidental, octave };
    }


    public toString(altPref: Accidental | null = null) {
        const noteSpelling = altPref
            ? this.toPitchSpelling(altPref)
            : this.toPitchSpelling()

        return noteSpelling.letter
            + noteSpelling.accidental
            + noteSpelling.octave
    }

    public static letterValue(letter: NoteLetter): number {
        return TUNE_HALFTONE_VALUES[letter]
    }

    public static accidentalValue(accidental: Accidental): number {
        return ALTERATION_VALUES[accidental]
    }

    public static octaveValue(octave: number): number {
        return octave * 12
    }
}
