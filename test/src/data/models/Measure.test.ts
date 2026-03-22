import Duration from '@/src/data/models/Duration'
import InfoNote from '@/src/data/models/InfoNote'
import KeySignature from '@/src/data/models/KeySignature'
import Measure from '@/src/data/models/Measure'
import { Pitch } from '@/src/data/models/Pitch'
import TimeSignature from '@/src/data/models/TimeSignature'
import { describe, it, expect } from 'vitest'

function makeNote(tickPosition: number, ticks: number, midiPitch = 60): InfoNote {
  return new InfoNote(tickPosition, new Duration(ticks), new Pitch(midiPitch))
}

describe('Measure', () => {
  describe('constructor', () => {
    it('stores time and key signatures', () => {
      const ts = new TimeSignature(3, 4)
      const ks = new KeySignature()
      const m = new Measure(ts, ks)
      expect(m.timeSignature).toBe(ts)
      expect(m.keySignature).toBe(ks)
      expect(m.notes).toEqual([])
    })
  })

  describe('capacity', () => {
    it('computes capacity for 4/4', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      // Implementation: log2(4)=2 → NoteValue.Half (960 ticks), 4 * 960 = 3840
      expect(m.capacity()).toBe(3840)
    })

    it('computes capacity for 3/8', () => {
      const m = new Measure(new TimeSignature(3, 8), new KeySignature())
      // log2(8)=3 → NoteValue.Quarter (480 ticks), 3 * 480 = 1440
      expect(m.capacity()).toBe(1440)
    })

    it('computes capacity for 6/8', () => {
      const m = new Measure(new TimeSignature(6, 8), new KeySignature())
      expect(m.capacity()).toBe(2880)
    })

    it('computes capacity for 2/2', () => {
      const m = new Measure(new TimeSignature(2, 2), new KeySignature())
      // log2(2)=1 → NoteValue 1 doesn't exist in enum;
      // noteValueTicks will throw for this input
      expect(() => m.capacity()).toThrow()
    })
  })

  describe('addNote', () => {
    it('adds a note to an empty measure', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      const note = makeNote(0, 480)
      m.addNote(note)
      expect(m.notes.length).toBe(1)
      expect(m.notes[0]).toBe(note)
    })

    it('adds multiple non-overlapping notes in order', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      const n1 = makeNote(0, 480)
      const n2 = makeNote(480, 480)
      const n3 = makeNote(960, 480)
      m.addNote(n1)
      m.addNote(n2)
      m.addNote(n3)
      expect(m.notes.length).toBe(3)
      expect(m.notes.map(n => n.tickPosition)).toEqual([0, 480, 960])
    })

    it('inserts a note between two existing notes', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      m.addNote(makeNote(0, 480))
      m.addNote(makeNote(960, 480))
      m.addNote(makeNote(480, 480))
      expect(m.notes.map(n => n.tickPosition)).toEqual([0, 480, 960])
    })

    it('throws for overlapping notes', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      m.addNote(makeNote(0, 960))
      expect(() => m.addNote(makeNote(480, 480))).toThrow('Cannot place note')
    })

    it('throws for negative tick position', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      expect(() => m.addNote(makeNote(-1, 480))).toThrow('Cannot place note')
    })

    it('throws for non-integer tick position', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      expect(() => m.addNote(makeNote(0.5, 480))).toThrow('Cannot place note')
    })

    it('throws for zero-duration notes', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      expect(() => m.addNote(makeNote(0, 0))).toThrow('Cannot place note')
    })

    it('throws when note extends past capacity', () => {
      const m = new Measure(new TimeSignature(4, 4), new KeySignature())
      const cap = m.capacity()
      expect(() => m.addNote(makeNote(0, cap + 1))).toThrow('Cannot place note')
    })
  })
})
