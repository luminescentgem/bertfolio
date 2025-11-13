
const pitches = "cdefgab"

class Note {
    constructor(
        public position: number,
        public duration: number,
        public pitch: Pitch,
    ) {}

    public title: string|null = null
    public link: string|null = null
    public summary: string|null = null
    public imageUrl: string|null = null

    public music() {
        return {
            duration: this.duration,
            pitch: this.pitch,
        }
    }

    public meta() {
        return {
            title: this.title,
            link: this.link,
            summary: this.summary,
            imageUrl: this.imageUrl,
        }
    }

    public pitchToY(key: Pitch, multiplier: number = 1) {

    }

    private pitchToValue(pitch: Pitch) {

    }

    private valueToPitch(val: number, alteration: Alteration) {
        
    }

    private switchEnharmonic(pitch: Pitch, alteration: Alteration) {

    }

    private dissect(pitch: Pitch) {
        if (pitch.length == 3) {
            return { note: pitch[0], alteration: pitch[1], octave: pitch[2] }
        }
        return { note: pitch[0], alteration: "", octave: pitch[1] }
    }
}