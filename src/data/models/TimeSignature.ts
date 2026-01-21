
export default class TimeSignature {
    constructor(
        public n: number,
        public d: number
    ) {
        // If denominator isn't a power of 2
        // TODO: Make a custom Error class for this
        if ((d & (d - 1)) !== 0) {
            throw Error(`Can't support time signature ${n}/${d}: denominator must be a power of 2`)
        }
    }

    public toString(): string {
        return `${this.n}/${this.d}`
    }

    public toArray(): [number, number] {
        return [this.n, this.d]
    }
}