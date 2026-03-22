import { describe, it, expect } from 'vitest'
import { ClefKind } from '@/src/data/models/Clef'
import KeySignature from '@/src/data/models/KeySignature'
import Measure from '@/src/data/models/Measure'
import Staff, { CLEF_PRESETS } from '@/src/data/models/Staff'
import TimeSignature from '@/src/data/models/TimeSignature'

describe('Staff', () => {
  describe('constructor defaults', () => {
    it('starts with no measures', () => {
      const s = new Staff()
      expect(s.measures).toEqual([])
    })

    it('defaults to treble clef', () => {
      const s = new Staff()
      expect(s.masterClef).toEqual(CLEF_PRESETS.Treble)
    })
  })

  describe('CLEF_PRESETS', () => {
    it('treble is G on line 2', () => {
      expect(CLEF_PRESETS.Treble).toEqual({ kind: ClefKind.G, line: 2, octaveShift: 0 })
    })

    it('bass is F on line 4', () => {
      expect(CLEF_PRESETS.Bass).toEqual({ kind: ClefKind.F, line: 4, octaveShift: 0 })
    })

    it('alto is C on line 3', () => {
      expect(CLEF_PRESETS.Alto).toEqual({ kind: ClefKind.C, line: 3, octaveShift: 0 })
    })

    it('tenor is C on line 4', () => {
      expect(CLEF_PRESETS.Tenor).toEqual({ kind: ClefKind.C, line: 4, octaveShift: 0 })
    })

    it('treble8 shifts down one octave', () => {
      expect(CLEF_PRESETS.Treble8.octaveShift).toBe(-1)
    })
  })

  describe('add / insert', () => {
    it('add appends a measure', () => {
      const s = new Staff()
      const m = new Measure(new TimeSignature(), new KeySignature())
      s.add(m)
      expect(s.measures.length).toBe(1)
      expect(s.measures[0]).toBe(m)
    })

    it('insert at 0 prepends', () => {
      const s = new Staff()
      const m1 = new Measure(new TimeSignature(), new KeySignature())
      const m2 = new Measure(new TimeSignature(), new KeySignature())
      s.add(m1)
      s.insert(m2, 0)
      expect(s.measures[0]).toBe(m2)
      expect(s.measures[1]).toBe(m1)
    })

    it('insert at end appends', () => {
      const s = new Staff()
      const m1 = new Measure(new TimeSignature(), new KeySignature())
      const m2 = new Measure(new TimeSignature(), new KeySignature())
      s.add(m1)
      s.insert(m2, 1)
      expect(s.measures[1]).toBe(m2)
    })

    it('throws on non-integer index', () => {
      const s = new Staff()
      const m = new Measure(new TimeSignature(), new KeySignature())
      expect(() => s.insert(m, 0.5)).toThrow('index must be an integer')
    })

    it('throws on negative index', () => {
      const s = new Staff()
      const m = new Measure(new TimeSignature(), new KeySignature())
      expect(() => s.insert(m, -1)).toThrow('index out of bounds')
    })

    it('throws on index beyond length', () => {
      const s = new Staff()
      const m = new Measure(new TimeSignature(), new KeySignature())
      expect(() => s.insert(m, 1)).toThrow('index out of bounds')
    })
  })

  describe('addEmpty / newEmptyAt', () => {
    it('addEmpty creates a measure with the staff signature and key', () => {
      const ts = new TimeSignature(3, 4)
      const ks = new KeySignature()
      const s = new Staff(ts, ks)
      s.addEmpty()
      expect(s.measures.length).toBe(1)
      expect(s.measures[0].timeSignature).toBe(ts)
      expect(s.measures[0].keySignature).toBe(ks)
    })

    it('newEmptyAt inserts at a specific position', () => {
      const s = new Staff()
      s.addEmpty()
      s.addEmpty()
      s.newEmptyAt(1)
      expect(s.measures.length).toBe(3)
    })
  })

  describe('measureOffsetTick', () => {
    it('returns 0 for index 0', () => {
      const s = new Staff()
      expect(s.measureOffsetTick(0)).toBe(0)
    })

    it('accumulates capacity of preceding measures', () => {
      const s = new Staff(new TimeSignature(4, 4))
      s.addEmpty()
      s.addEmpty()
      s.addEmpty()
      const cap = s.measures[0].capacity()
      expect(s.measureOffsetTick(1)).toBe(cap)
      expect(s.measureOffsetTick(2)).toBe(cap * 2)
      expect(s.measureOffsetTick(3)).toBe(cap * 3)
    })

    it('throws for negative index', () => {
      const s = new Staff()
      expect(() => s.measureOffsetTick(-1)).toThrow()
    })

    it('throws for index beyond length', () => {
      const s = new Staff()
      s.addEmpty()
      expect(() => s.measureOffsetTick(3)).toThrow('index too large')
    })
  })

  describe('totalTicks', () => {
    it('returns 0 for empty staff', () => {
      const s = new Staff()
      expect(s.totalTicks()).toBe(0)
    })

    it('equals measureOffsetTick(length)', () => {
      const s = new Staff(new TimeSignature(4, 4))
      s.addEmpty()
      s.addEmpty()
      expect(s.totalTicks()).toBe(s.measureOffsetTick(s.measures.length))
    })
  })

  describe('getMeasure', () => {
    it('returns existing measure', () => {
      const s = new Staff()
      s.addEmpty()
      expect(s.getMeasure(0)).toBe(s.measures[0])
    })

    it('auto-creates measures up to requested index by default', () => {
      const s = new Staff()
      const m = s.getMeasure(3)
      expect(s.measures.length).toBe(4)
      expect(m).toBe(s.measures[3])
    })

    it('returns undefined when autoCreate is false and index is out of range', () => {
      const s = new Staff()
      expect(s.getMeasure(5, { autoCreate: false })).toBeUndefined()
      expect(s.measures.length).toBe(0)
    })

    it('throws for negative index', () => {
      const s = new Staff()
      expect(() => s.getMeasure(-1)).toThrow()
    })

    it('throws for non-integer index', () => {
      const s = new Staff()
      expect(() => s.getMeasure(1.5)).toThrow()
    })
  })

  describe('clef overrides', () => {
    it('getClefAtMeasure returns masterClef when no override', () => {
      const s = new Staff(new TimeSignature(), new KeySignature(), CLEF_PRESETS.Bass)
      expect(s.getClefAtMeasure(0)).toEqual(CLEF_PRESETS.Bass)
      expect(s.getClefAtMeasure(5)).toEqual(CLEF_PRESETS.Bass)
    })

    it('setClefOverride replaces clef at a specific measure', () => {
      const s = new Staff(new TimeSignature(), new KeySignature(), CLEF_PRESETS.Treble)
      s.setClefOverride(2, CLEF_PRESETS.Bass)
      expect(s.getClefAtMeasure(1)).toEqual(CLEF_PRESETS.Treble)
      expect(s.getClefAtMeasure(2)).toEqual(CLEF_PRESETS.Bass)
      expect(s.getClefAtMeasure(3)).toEqual(CLEF_PRESETS.Treble)
    })

    it('clearClefOverride restores masterClef', () => {
      const s = new Staff(new TimeSignature(), new KeySignature(), CLEF_PRESETS.Treble)
      s.setClefOverride(2, CLEF_PRESETS.Bass)
      s.clearClefOverride(2)
      expect(s.getClefAtMeasure(2)).toEqual(CLEF_PRESETS.Treble)
    })

    it('throws for negative measureIndex', () => {
      const s = new Staff()
      expect(() => s.setClefOverride(-1, CLEF_PRESETS.Bass)).toThrow('bad measureIndex')
    })

    it('throws for non-integer measureIndex', () => {
      const s = new Staff()
      expect(() => s.setClefOverride(1.5, CLEF_PRESETS.Bass)).toThrow('bad measureIndex')
    })
  })
})
