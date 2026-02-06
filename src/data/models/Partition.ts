import Staff from "./Staff";
import TimeSignature from "./TimeSignature";
import KeySignature from "./KeySignature";

type MeasureColumn = {
    masterTimeSignature: TimeSignature
    bpm: number
}

export default class Partition {
    public staves: Array<Staff> = []
    public measureColumns: Array<MeasureColumn> = []
    constructor(
        public signature: TimeSignature = new TimeSignature(),
        public key: KeySignature,
        public bpm: number
    ) {
    }

    public insertNewMeasureAt(index: number) {
        if (!Number.isInteger(index)) throw new Error("index must be an integer")
        if (index < 0 || index > this.measureColumns.length) {
            throw new Error(`index out of bounds: ${index}`)
        }
        this.staves.forEach(staff => {
            staff.newEmptyAt(index)
        })
    }

    public addMeasure() {
        this.insertNewMeasureAt(this.measureColumns.length)
    }

    public addStaff() {
        this.staves.push(new Staff())
    }
}