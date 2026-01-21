type NvD = { noteValue: NoteValue; dots: number };

const QUARTER_TICKS = 480;

// Canonical, integer-only: base (undotted) ticks per NoteValue
const NOTE_VALUE_TICKS: Record<NoteValue, number> = {
  [NoteValue.Maxima]:  32 * QUARTER_TICKS,
  [NoteValue.Longa]:   16 * QUARTER_TICKS,
  [NoteValue.Breve]:    8 * QUARTER_TICKS,
  [NoteValue.Whole]:    4 * QUARTER_TICKS,
  [NoteValue.Half]:     2 * QUARTER_TICKS,
  [NoteValue.Quarter]:  1 * QUARTER_TICKS,
  [NoteValue.Eighth]:       QUARTER_TICKS / 2,
  [NoteValue.Sixteenth]:    QUARTER_TICKS / 4,
  [NoteValue.ThirtySecond]: QUARTER_TICKS / 8,
  [NoteValue.SixtyFourth]:  QUARTER_TICKS / 16,
};

// Reverse map: ticks -> NoteValue (also integer-only)
const entries = Object.entries(NOTE_VALUE_TICKS) as unknown as Array<[NoteValue, number]>;

const TICKS_NOTE_VALUE: Record<number, NoteValue> = entries.reduce((acc, [nv, ticks]) => {
  acc[ticks] = nv;
  return acc;
}, {} as Record<number, NoteValue>);


// Dots as exact rational multipliers (integer-safe comparisons)
const DOT_FRACTIONS: Array<[dots: number, num: number, den: number]> = [
  [0, 1, 1],
  [1, 3, 2],
  [2, 7, 4],
  [3, 15, 8],
];

export default class Duration {
  constructor(public ticks: number) {}

  public static fromNvD(nvd: NvD) {
    const base = Duration.noteValueTicks(nvd.noteValue);
    const [num, den] = Duration.dotsFractions(nvd.dots);

    // Ensure integer ticks; if not, your QUARTER_TICKS is too small for that value.
    const t = (base * num) / den;
    if (!Number.isInteger(t)) {
      throw new Error(
        `fromNvD produced non-integer ticks: base=${base}, dots=${nvd.dots} => ${t}. Increase QUARTER_TICKS.`
      );
    }
    return new Duration(t);
  }

  public toNvD(): NvD {
    for (const [nvKey, baseTicks] of Object.entries(NOTE_VALUE_TICKS)) {
      const noteValue = nvKey as unknown as NoteValue;

      for (const [dots, num, den] of DOT_FRACTIONS) {
        // exact integer comparison: baseTicks * num / den === ticks
        if (baseTicks * num === this.ticks * den) {
          return { noteValue, dots };
        }
      }
    }
    throw new Error(
      `Duration ${this.ticks} ticks is not a standard dotted note value`
    );
  }

  public static noteValueTicks(nv: NoteValue): number {
    const t = NOTE_VALUE_TICKS[nv];
    if (t == null) throw new Error(`Unknown NoteValue: ${String(nv)}`);
    return t;
  }

  public static dotsFractions(dots: number): [number, number] {
    const entry = DOT_FRACTIONS.find(([d]) => d === dots);
    if (!entry) throw new Error(`Unsupported dots count: ${dots}`);
    const [, num, den] = entry;
    return [num, den];
  }
}
