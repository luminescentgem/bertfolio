class Pitch {
    constructor(
        public tune: Tune,
        public alteration: Alteration,
        public octave: number,
    ) {}

    public toString() {
        return this.tune + this.alteration + this.octave
    }
}