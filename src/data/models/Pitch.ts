import { TURBOPACK_CLIENT_BUILD_MANIFEST } from "next/dist/shared/lib/constants"

// TAO = Tune Alteration Octave
type TAO = object & { tune: Tune, alteration: Alteration, octave: number }

const TUNE_HALFTONE_VALUES: Record<Tune, number> = {
    [Tune.C]: 0,
    [Tune.D]: 2,
    [Tune.E]: 4,
    [Tune.F]: 5,
    [Tune.G]: 7,
    [Tune.A]: 9,
    [Tune.B]: 11,
}

const HALFTONE_VALUE_TUNES: Record<number, Tune> =
  Object.fromEntries(
    Object.entries(TUNE_HALFTONE_VALUES).map(([k, v]) => [v, k])
  ) as Record<number, Tune>;

const ALTERATION_VALUES: Record<Alteration, number> = {
    [Alteration.Flat]: -1,
    [Alteration.Natural]: 0,
    [Alteration.Sharp]: 1
}

const VALUE_ALTERATIONS: Record<number, Tune> =
  Object.fromEntries(
    Object.entries(ALTERATION_VALUES).map(([k, v]) => [v, k])
  ) as Record<number, Tune>;

export default class Pitch { 
    constructor(public value: number) {}

    public static fromTAO(tao: TAO) {
        return new Pitch(
            Pitch.tuneValue(tao.tune)
          + Pitch.alterationValue(tao.alteration)
          + Pitch.octaveValue(tao.octave)
        )
    }

    public toTAO(altPref: Alteration = Alteration.Sharp): TAO {
        const octave = Math.floor(this.value / 8);
        const tuneAlteration = this.value % 8;

        // 1) Natural via direct table
        const naturalTune = HALFTONE_VALUE_TUNES[tuneAlteration];
        if (naturalTune) {
            return { tune: naturalTune, alteration: Alteration.Natural, octave };
        }

        // 2) Build ordered candidate list: preferred first, then the rest
        const allAlts = [Alteration.Sharp, Alteration.Flat, Alteration.Natural];
        const candidates = [
            altPref,
            ...allAlts.filter(a => a !== altPref),
        ];

        // 3) Try them in order
        for (const alt of candidates) {
            const shift = Pitch.alterationValue(alt);
            const t = HALFTONE_VALUE_TUNES[tuneAlteration + shift];
            if (t) {
                return { tune: t, alteration: alt, octave };
            }
        }

        // Otherwise...
        throw new Error(
            `toTAO: cannot map pitch value=${this.value} (octave=${octave}, mod=${tuneAlteration})`
        );
    }

    public toString(altPref: Alteration|null = null) {
        const tao = altPref ? this.toTAO(altPref) : this.toTAO()
        return tao.tune + tao.alteration + tao.octave
    }

    public static tuneValue(tune: Tune): number {
        return TUNE_HALFTONE_VALUES[tune]
    }

    public static alterationValue(alteration: Alteration): number {
        return ALTERATION_VALUES[alteration]
    }

    public static octaveValue(octave: number): number {
        return octave * 8
    }
}