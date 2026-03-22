import { describe, it, expect } from 'vitest'
import { Accidental } from '@/src/data/enums/Accidental'
import { NoteLetter } from '@/src/data/enums/NoteLetter'
import { Pitch } from '@/src/data/models/Pitch'

describe('Pitch', () => {
  describe('fromPitchSpelling', () => {
    it('creates middle C (C4) correctly', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.C, accidental: Accidental.Natural, octave: 4 })
      // C=0, natural=0, octave 4 = 48 → value 48
      expect(p.value).toBe(48)
    })

    it('creates A4 (concert pitch)', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.A, accidental: Accidental.Natural, octave: 4 })
      // A=9, natural=0, octave 4 = 48 → value 57
      expect(p.value).toBe(57)
    })

    it('applies sharp accidental', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.F, accidental: Accidental.Sharp, octave: 3 })
      // F=5, sharp=1, octave 3=36 → 42
      expect(p.value).toBe(42)
    })

    it('applies flat accidental', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.B, accidental: Accidental.Flat, octave: 2 })
      // B=11, flat=-1, octave 2=24 → 34
      expect(p.value).toBe(34)
    })
  })

  describe('octave', () => {
    it('returns the octave number', () => {
      expect(new Pitch(48).octave()).toBe(4)  // C4
      expect(new Pitch(0).octave()).toBe(0)   // C0
      expect(new Pitch(60).octave()).toBe(5)  // C5
      expect(new Pitch(59).octave()).toBe(4)  // B4
    })

    it('handles negative values', () => {
      expect(new Pitch(-1).octave()).toBe(-1)
    })
  })

  describe('pitchClass', () => {
    it('extracts the pitch class as a NoteSpelling', () => {
      const p = new Pitch(48) // C4
      expect(p.pitchClass().value).toBe(0)
    })

    it('wraps correctly across octaves', () => {
      // All these are A (value 9 mod 12)
      expect(new Pitch(9).pitchClass().value).toBe(9)
      expect(new Pitch(21).pitchClass().value).toBe(9)
      expect(new Pitch(57).pitchClass().value).toBe(9)
    })
  })

  describe('toPitchSpelling', () => {
    it('round-trips from a natural note', () => {
      const original = { letter: NoteLetter.G, accidental: Accidental.Natural, octave: 3 }
      const p = Pitch.fromPitchSpelling(original)
      const result = p.toPitchSpelling()
      expect(result).toEqual(original)
    })

    it('round-trips a sharp note when sharp preference is used', () => {
      const original = { letter: NoteLetter.C, accidental: Accidental.Sharp, octave: 5 }
      const p = Pitch.fromPitchSpelling(original)
      const result = p.toPitchSpelling(Accidental.Sharp)
      expect(result).toEqual(original)
    })

    it('re-spells a sharp as flat when flat preference is used', () => {
      // C#5 = Db5
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.C, accidental: Accidental.Sharp, octave: 5 })
      const result = p.toPitchSpelling(Accidental.Flat)
      expect(result).toEqual({ letter: NoteLetter.D, accidental: Accidental.Flat, octave: 5 })
    })
  })

  describe('toString', () => {
    it('formats a natural note', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.C, accidental: Accidental.Natural, octave: 4 })
      expect(p.toString()).toBe('C4')
    })

    it('formats a sharp note', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.F, accidental: Accidental.Sharp, octave: 3 })
      expect(p.toString()).toBe('F#3')
    })

    it('formats with explicit flat preference', () => {
      const p = Pitch.fromPitchSpelling({ letter: NoteLetter.F, accidental: Accidental.Sharp, octave: 3 })
      expect(p.toString(Accidental.Flat)).toBe('Gb3')
    })
  })

  describe('octaveValue', () => {
    it('returns octave * 12', () => {
      expect(Pitch.octaveValue(0)).toBe(0)
      expect(Pitch.octaveValue(4)).toBe(48)
      expect(Pitch.octaveValue(8)).toBe(96)
    })
  })
})
