import InfoNote from "./InfoNote"
import TimeSignature from "./TimeSignature"
import Duration from "./Duration"
import KeySignature from "./KeySignature";

export default class Measure {
    public notes: Array<InfoNote> = []
    constructor(
        public timeSignature: TimeSignature,
        public keySignature: KeySignature
    ) { }

    public addNote(note: InfoNote) {
        const place = this.findPlace(note);
        if (place < 0) {
            throw new Error("Cannot place note"
              + `at tick position ${note.tickPosition}`
              + `with duration ${note.tickDuration.ticks}`
              + `in ${this.timeSignature.toString()} measure`
            )
        }
        this.notes.splice(place, 0, note);
    }

    public capacity(): number {
        const [nBeats, expB2BeatValue] = this.timeSignature.toArray()
        const beatValue: NoteValue = Math.log2(expB2BeatValue)
        const ticksPerBeat = Duration.noteValueTicks(beatValue)
        return nBeats * ticksPerBeat
    }

    private findPlace(note: InfoNote): number {
        const cap = this.capacity();
        const pos = note.tickPosition

        // Basic bounds
        const dur = note.tickDuration.ticks;
        if ((!Number.isInteger(pos) || pos < 0)
        ||  (!Number.isInteger(dur) || dur <= 0)
        ||  (pos + dur > cap)) return -1;

        // Assumes this.notes is sorted ascending by position (in ticks)
        const notes = this.notes; // adjust field name

        // Dichotomy: first index with position > ticks
        const upper_bound = (target: number) => {
            let lo = 0;
            let hi = notes.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (notes[mid].tickPosition <= target) lo = mid + 1;
                else hi = mid;
            }
            return lo
        }

        const idx = upper_bound(pos);

        // Check overlap with previous note
        if (idx > 0) {
            const prev = notes[idx - 1];
            const prevEnd = prev.tickPosition + prev.tickDuration.ticks;
            if (prevEnd > pos) return -1;
        }

        // Check overlap with next note
        if (idx < notes.length) {
            const next = notes[idx];
            if (pos + dur > next.tickPosition) return -1;
        }

        return idx-1;
    }

}
