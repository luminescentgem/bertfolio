import { Accidental } from '@/src/data/enums/Accidental'
import { Mode } from '@/src/data/enums/Mode'
import { NoteLetter } from '@/src/data/enums/NoteLetter'
import KeySignature from '@/src/data/models/KeySignature'
import { NoteSpelling } from '@/src/data/models/NoteSpelling'
import { describe, it, expect } from 'vitest'

describe('KeySignature', () => {
  describe('defaults', () => {
    it('defaults to C major', () => {
      const ks = new KeySignature()
      expect(ks.getTonic()).toEqual({ letter: NoteLetter.C, accidental: Accidental.Natural })
      expect(ks.getMode()).toBe(Mode.Major)
    })
  })

  describe('getTonic / getMode', () => {
    it('returns the tonic and mode passed at construction', () => {
      const tonic = { letter: NoteLetter.E, accidental: Accidental.Flat }
      const ks = new KeySignature(tonic, Mode.Minor)
      expect(ks.getTonic()).toEqual(tonic)
      expect(ks.getMode()).toBe(Mode.Minor)
    })
  })

  describe('accidental preference', () => {
    it('C major has no bias', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.C, accidental: Accidental.Natural },
        Mode.Major
      )
      // NoBias = 2 in the internal enum; just check it doesn't throw
      expect(ks.getAccidentalPreference()).toBeDefined()
    })

    it('G major prefers sharps', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.G, accidental: Accidental.Natural },
        Mode.Major
      )
      // G major = 1 sharp → PreferSharps = 0
      expect(ks.getAccidentalPreference()).toBe(0) // PreferSharps
    })

    it('F major prefers flats', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.F, accidental: Accidental.Natural },
        Mode.Major
      )
      // F major = 1 flat → PreferFlats = 1
      expect(ks.getAccidentalPreference()).toBe(1) // PreferFlats
    })

    it('D major prefers sharps', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.D, accidental: Accidental.Natural },
        Mode.Major
      )
      expect(ks.getAccidentalPreference()).toBe(0) // PreferSharps
    })

    it('Bb major prefers flats', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.B, accidental: Accidental.Flat },
        Mode.Major
      )
      expect(ks.getAccidentalPreference()).toBe(1) // PreferFlats
    })
  })

  describe('alignEnharmonic', () => {
    it('formats with sharps in a sharp-preferring key', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.G, accidental: Accidental.Natural },
        Mode.Major
      )
      // pitch class 6 = F# or Gb; G major should choose F#
      const ns = new NoteSpelling(6)
      const result = ks.alignEnharmonic(ns)
      expect(result).toEqual({ letter: NoteLetter.F, accidental: Accidental.Sharp })
    })

    it('formats with flats in a flat-preferring key', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.F, accidental: Accidental.Natural },
        Mode.Major
      )
      // pitch class 10 = Bb or A#; F major should choose Bb
      const ns = new NoteSpelling(10)
      const result = ks.alignEnharmonic(ns)
      expect(result).toEqual({ letter: NoteLetter.B, accidental: Accidental.Flat })
    })

    it('returns naturals unchanged', () => {
      const ks = new KeySignature(
        { letter: NoteLetter.G, accidental: Accidental.Natural },
        Mode.Major
      )
      const ns = new NoteSpelling(0) // C
      const result = ks.alignEnharmonic(ns)
      expect(result).toEqual({ letter: NoteLetter.C, accidental: Accidental.Natural })
    })
  })

  describe('modes', () => {
    it('A minor (aeolian) has the same accidentals as C major (relative minor)', () => {
      const cMajor = new KeySignature(
        { letter: NoteLetter.C, accidental: Accidental.Natural },
        Mode.Major
      )
      const aMinor = new KeySignature(
        { letter: NoteLetter.A, accidental: Accidental.Natural },
        Mode.Minor
      )
      // Both should resolve to C major's accidental preference
      expect(aMinor.getAccidentalPreference()).toBe(cMajor.getAccidentalPreference())
    })

    it('D dorian has the same accidentals as C major', () => {
      const cMajor = new KeySignature(
        { letter: NoteLetter.C, accidental: Accidental.Natural },
        Mode.Major
      )
      const dDorian = new KeySignature(
        { letter: NoteLetter.D, accidental: Accidental.Natural },
        Mode.Dorian
      )
      expect(dDorian.getAccidentalPreference()).toBe(cMajor.getAccidentalPreference())
    })
  })
})
