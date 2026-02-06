import KeySignature from "./KeySignature";
import Measure from "./Measure";
import TimeSignature from "./TimeSignature";

export default class Staff {
    
    public measures: Array<Measure> = []
    constructor(
        public signature: TimeSignature = new TimeSignature(),
        public key: KeySignature = new KeySignature()
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
}