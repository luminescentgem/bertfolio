import Pitch from "./Pitch"
import NoteData from "./NoteData"
import Duration from "./Duration"

export default class InfoNote {
    constructor(
        public tickPosition: number,
        public tickDuration: Duration,
        public pitch: Pitch,
    ) {}

    public data: NoteData|null = null
}