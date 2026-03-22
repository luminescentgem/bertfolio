import { Clef, ClefKind } from "./Clef"
import KeySignature from "./KeySignature"
import Measure from "./Measure"
import TimeSignature from "./TimeSignature"

export const CLEF_PRESETS = {
  Treble:  { kind: ClefKind.G, line: 2, octaveShift: 0 },
  Treble8: { kind: ClefKind.G, line: 2, octaveShift: -1 },
  Bass:    { kind: ClefKind.F, line: 4, octaveShift: 0 },
  Bass8:   { kind: ClefKind.F, line: 4, octaveShift: -1 },
  Alto:    { kind: ClefKind.C, line: 3, octaveShift: 0 },
  Tenor:   { kind: ClefKind.C, line: 4, octaveShift: 0 },
} as const;

export default class Staff {
    public measures: Array<Measure> = []
    public clefOverrides: Map<number, Clef> = new Map
    constructor(
        public signature: TimeSignature = new TimeSignature(),
        public key: KeySignature = new KeySignature(),
        public masterClef: Clef = CLEF_PRESETS.Treble
    ) {
    }

    public insert(measure: Measure, index: number) {
        if (!Number.isInteger(index)) throw new Error("index must be an integer")
        if (index < 0 || index > this.measures.length) {
            throw new Error(`index out of bounds: ${index}`)
        }
        this.measures.splice(index, 0, measure)
    }

    public add(measure: Measure) {
        this.insert(measure, this.measures.length)
    }

    public newEmptyAt(index: number) {
        this.insert(
            new Measure(this.signature, this.key),
            index
        )
    }

    public addEmpty() {
        this.newEmptyAt(this.measures.length)
    }

    public measureOffsetTick(index: number): number {
        if (!Number.isInteger(index)) throw new Error("index must be an integer")
        if (index < 0) throw new Error("index must be >= 0");
        if (index > this.measures.length) {
            throw new Error(
                `index too large: ${index} (measures: ${this.measures.length})`
            )
        }
        let acc = 0
        for (let i = 0; i < index; i++) {
            acc += this.measures[i].capacity()
        }
        return acc
    }

    public totalTicks(): number {
        return this.measureOffsetTick(this.measures.length)
    }

    public getMeasure(index: number, opts: { autoCreate?: boolean } = {}): Measure | undefined {
        const { autoCreate = true } = opts

        if (!Number.isInteger(index)) throw new Error("index must be an integer")
        if (index < 0) throw new Error("index must be >= 0")

        if (index < this.measures.length) return this.measures[index]
        if (!autoCreate) return undefined

        while (this.measures.length <= index) {
            this.addEmpty()
        }
        return this.measures[index]
    }
    public setClefOverride(measureIndex: number, clef: Clef): void {
        if (!Number.isInteger(measureIndex) || measureIndex < 0) throw new Error("bad measureIndex")
        this.clefOverrides.set(measureIndex, clef)
    }

    public clearClefOverride(measureIndex: number): void {
        this.clefOverrides.delete(measureIndex)
    }

    public getClefAtMeasure(measureIndex: number): Clef {
        return this.clefOverrides.get(measureIndex) ?? this.masterClef
    }
}