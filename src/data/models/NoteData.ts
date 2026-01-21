

export default class NoteData {
    constructor(
        public title: string|null = null,
        public link: string|null = null,
        public summary: string|null = null,
        public imageUrl: string|null = null
    ) {}
}