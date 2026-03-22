import { describe, it, expect } from 'vitest'
import { Accidental } from '@/src/data/enums/Accidental'
import { NoteLetter } from '@/src/data/enums/NoteLetter'
import { NoteSpelling } from '@/src/data/models/NoteSpelling'

describe('NoteSpelling', () => {
  describe('constructor normalizes pitch class to 0..11', () => {
    it('stores values in range as-is', () => {
      expect(new NoteSpelling(0).value).toBe(0)
      expect(new NoteSpelling(7).value).toBe(7)
      expect(new NoteSpelling(11).value).toBe(11)
    })

    it('wraps values >= 12', () => {
      expect(new NoteSpelling(12).value).toBe(0)
      expect(new NoteSpelling(14).value).toBe(2)
      expect(new NoteSpelling(25).value).toBe(1)
    })

    it('wraps negative values', () => {
      expect(new NoteSpelling(-1).value).toBe(11)
      expect(new NoteSpelling(-12).value).toBe(0)
      expect(new NoteSpelling(-13).value).toBe(11)
    })
  })

  describe('letterValue', () => {
    it('returns correct semitone offsets for all natural notes', () => {
      expect(NoteSpelling.letterValue(NoteLetter.C)).toBe(0)
      expect(NoteSpelling.letterValue(NoteLetter.D)).toBe(2)
      expect(NoteSpelling.letterValue(NoteLetter.E)).toBe(4)
      expect(NoteSpelling.letterValue(NoteLetter.F)).toBe(5)
      expect(NoteSpelling.letterValue(NoteLetter.G)).toBe(7)
      expect(NoteSpelling.letterValue(NoteLetter.A)).toBe(9)
      expect(NoteSpelling.letterValue(NoteLetter.B)).toBe(11)
    })
  })

  describe('accidentalValue', () => {
    it('returns correct offsets', () => {
      expect(NoteSpelling.accidentalValue(Accidental.Flat)).toBe(-1)
      expect(NoteSpelling.accidentalValue(Accidental.Natural)).toBe(0)
      expect(NoteSpelling.accidentalValue(Accidental.Sharp)).toBe(1)
    })
  })

  describe('viewValue', () => {
    it('sums letter and accidental values', () => {
      // C natural = 0
      expect(NoteSpelling.viewValue({ letter: NoteLetter.C, accidental: Accidental.Natural })).toBe(0)
      // C# = 1
      expect(NoteSpelling.viewValue({ letter: NoteLetter.C, accidental: Accidental.Sharp })).toBe(1)
      // Bb = 10
      expect(NoteSpelling.viewValue({ letter: NoteLetter.B, accidental: Accidental.Flat })).toBe(10)
      // F# = 6
      expect(NoteSpelling.viewValue({ letter: NoteLetter.F, accidental: Accidental.Sharp })).toBe(6)
    })
  })

  describe('format', () => {
    it('returns natural for natural pitch classes', () => {
      // C = 0
      expect(new NoteSpelling(0).format()).toEqual({ letter: NoteLetter.C, accidental: Accidental.Natural })
      // D = 2
      expect(new NoteSpelling(2).format()).toEqual({ letter: NoteLetter.D, accidental: Accidental.Natural })
      // E = 4
      expect(new NoteSpelling(4).format()).toEqual({ letter: NoteLetter.E, accidental: Accidental.Natural })
      // F = 5
      expect(new NoteSpelling(5).format()).toEqual({ letter: NoteLetter.F, accidental: Accidental.Natural })
      // G = 7
      expect(new NoteSpelling(7).format()).toEqual({ letter: NoteLetter.G, accidental: Accidental.Natural })
      // A = 9
      expect(new NoteSpelling(9).format()).toEqual({ letter: NoteLetter.A, accidental: Accidental.Natural })
      // B = 11
      expect(new NoteSpelling(11).format()).toEqual({ letter: NoteLetter.B, accidental: Accidental.Natural })
    })

    it('defaults to sharp for non-natural pitch classes', () => {
      // pc 1 = C#
      expect(new NoteSpelling(1).format()).toEqual({ letter: NoteLetter.C, accidental: Accidental.Sharp })
      // pc 6 = F#
      expect(new NoteSpelling(6).format()).toEqual({ letter: NoteLetter.F, accidental: Accidental.Sharp })
    })

    it('uses flat preference when requested', () => {
      // pc 1 with flat pref = Db
      expect(new NoteSpelling(1).format(Accidental.Flat)).toEqual({ letter: NoteLetter.D, accidental: Accidental.Flat })
      // pc 6 with flat pref = Gb
      expect(new NoteSpelling(6).format(Accidental.Flat)).toEqual({ letter: NoteLetter.G, accidental: Accidental.Flat })
      // pc 8 with flat pref = Ab
      expect(new NoteSpelling(8).format(Accidental.Flat)).toEqual({ letter: NoteLetter.A, accidental: Accidental.Flat })
    })

    it('covers all 12 pitch classes without throwing', () => {
      for (let pc = 0; pc < 12; pc++) {
        const ns = new NoteSpelling(pc)
        expect(() => ns.format(Accidental.Sharp)).not.toThrow()
        expect(() => ns.format(Accidental.Flat)).not.toThrow()
      }
    })
  })

  describe('fromView', () => {
    it('round-trips with viewValue', () => {
      const dto = { letter: NoteLetter.F, accidental: Accidental.Sharp }
      const ns = NoteSpelling.fromView(dto)
      expect(ns.value).toBe(6)
    })
  })
})
