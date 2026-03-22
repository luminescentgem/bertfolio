import { describe, it, expect } from 'vitest'
import Duration from '@/src/data/models/Duration'
import { NoteValue } from '@/src/data/enums/NoteValue'

describe('Duration', () => {
  describe('noteValueTicks', () => {
    it('returns correct base ticks for standard note values', () => {
      expect(Duration.noteValueTicks(NoteValue.Whole)).toBe(1920)
      expect(Duration.noteValueTicks(NoteValue.Half)).toBe(960)
      expect(Duration.noteValueTicks(NoteValue.Quarter)).toBe(480)
      expect(Duration.noteValueTicks(NoteValue.Eighth)).toBe(240)
      expect(Duration.noteValueTicks(NoteValue.Sixteenth)).toBe(120)
      expect(Duration.noteValueTicks(NoteValue.ThirtySecond)).toBe(60)
      expect(Duration.noteValueTicks(NoteValue.SixtyFourth)).toBe(30)
    })

    it('returns correct ticks for extended values', () => {
      expect(Duration.noteValueTicks(NoteValue.Breve)).toBe(3840)
      expect(Duration.noteValueTicks(NoteValue.Longa)).toBe(7680)
      expect(Duration.noteValueTicks(NoteValue.Maxima)).toBe(15360)
    })

    it('throws for unknown note values', () => {
      expect(() => Duration.noteValueTicks(99 as NoteValue)).toThrow('Unknown NoteValue')
    })
  })

  describe('dotsFractions', () => {
    it('returns [1, 1] for 0 dots', () => {
      expect(Duration.dotsFractions(0)).toEqual([1, 1])
    })

    it('returns [3, 2] for 1 dot', () => {
      expect(Duration.dotsFractions(1)).toEqual([3, 2])
    })

    it('returns [7, 4] for 2 dots', () => {
      expect(Duration.dotsFractions(2)).toEqual([7, 4])
    })

    it('returns [15, 8] for 3 dots', () => {
      expect(Duration.dotsFractions(3)).toEqual([15, 8])
    })

    it('throws for unsupported dot counts', () => {
      expect(() => Duration.dotsFractions(4)).toThrow('Unsupported dots count')
      expect(() => Duration.dotsFractions(-1)).toThrow('Unsupported dots count')
    })
  })

  describe('fromNotatedDuration', () => {
    it('creates correct ticks for undotted quarter note', () => {
      const d = Duration.fromNotatedDuration({ noteValue: NoteValue.Quarter, dots: 0 })
      expect(d.ticks).toBe(480)
    })

    it('creates correct ticks for dotted quarter note', () => {
      // 480 * 3/2 = 720
      const d = Duration.fromNotatedDuration({ noteValue: NoteValue.Quarter, dots: 1 })
      expect(d.ticks).toBe(720)
    })

    it('creates correct ticks for double-dotted half note', () => {
      // 960 * 7/4 = 1680
      const d = Duration.fromNotatedDuration({ noteValue: NoteValue.Half, dots: 2 })
      expect(d.ticks).toBe(1680)
    })

    it('creates correct ticks for undotted whole note', () => {
      const d = Duration.fromNotatedDuration({ noteValue: NoteValue.Whole, dots: 0 })
      expect(d.ticks).toBe(1920)
    })

    it('creates correct ticks for dotted eighth note', () => {
      // 240 * 3/2 = 360
      const d = Duration.fromNotatedDuration({ noteValue: NoteValue.Eighth, dots: 1 })
      expect(d.ticks).toBe(360)
    })
  })

  describe('toNotatedDuration', () => {
    it('identifies a quarter note from 480 ticks', () => {
      const d = new Duration(480)
      expect(d.toNotatedDuration()).toEqual({ noteValue: NoteValue.Quarter, dots: 0 })
    })

    it('identifies a dotted quarter from 720 ticks', () => {
      const d = new Duration(720)
      expect(d.toNotatedDuration()).toEqual({ noteValue: NoteValue.Quarter, dots: 1 })
    })

    it('identifies a whole note from 1920 ticks', () => {
      const d = new Duration(1920)
      expect(d.toNotatedDuration()).toEqual({ noteValue: NoteValue.Whole, dots: 0 })
    })

    it('throws for non-standard tick values', () => {
      expect(() => new Duration(17).toNotatedDuration()).toThrow('not a standard dotted note value')
    })

    it('round-trips all undotted standard values', () => {
      const values = [
        NoteValue.Maxima, NoteValue.Longa, NoteValue.Breve,
        NoteValue.Whole, NoteValue.Half, NoteValue.Quarter,
        NoteValue.Eighth, NoteValue.Sixteenth, NoteValue.ThirtySecond,
        NoteValue.SixtyFourth,
      ]
      for (const nv of values) {
        const d = Duration.fromNotatedDuration({ noteValue: nv, dots: 0 })
        const back = d.toNotatedDuration()
        expect(back.dots).toBe(0)
        // noteValue comes back as a string key from Object.entries;
        // compare ticks instead for robustness
        expect(Duration.noteValueTicks(back.noteValue as NoteValue)).toBe(d.ticks)
      }
    })
  })
})
