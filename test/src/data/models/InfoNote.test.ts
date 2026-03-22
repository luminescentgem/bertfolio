import { describe, it, expect } from 'vitest'
import Duration from '@/src/data/models/Duration'
import InfoNote from '@/src/data/models/InfoNote'
import NoteData from '@/src/data/models/NoteData'
import { Pitch } from '@/src/data/models/Pitch'


describe('InfoNote', () => {
  it('stores tickPosition, tickDuration, and pitch', () => {
    const pitch = new Pitch(60)
    const dur = new Duration(480)
    const note = new InfoNote(0, dur, pitch)
    expect(note.tickPosition).toBe(0)
    expect(note.tickDuration).toBe(dur)
    expect(note.pitch).toBe(pitch)
  })

  it('defaults data to null', () => {
    const note = new InfoNote(0, new Duration(480), new Pitch(60))
    expect(note.data).toBeNull()
  })

  it('accepts NoteData assignment', () => {
    const note = new InfoNote(0, new Duration(480), new Pitch(60))
    const data = new NoteData('A Title', 'https://example.com')
    note.data = data
    expect(note.data).toBe(data)
    expect(note.data.title).toBe('A Title')
  })
})
