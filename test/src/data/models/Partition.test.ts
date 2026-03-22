import { describe, it, expect } from 'vitest'
import KeySignature from '@/src/data/models/KeySignature'
import Partition from '@/src/data/models/Partition'
import TimeSignature from '@/src/data/models/TimeSignature'

describe('Partition', () => {
  function makePartition(n = 4, d = 4, bpm = 120) {
    return new Partition(new TimeSignature(n, d), new KeySignature(), bpm)
  }

  describe('constructor', () => {
    it('starts with no staves and no measure columns', () => {
      const p = makePartition()
      expect(p.staves).toEqual([])
      expect(p.measureColumns).toEqual([])
    })

    it('stores signature, key, and bpm', () => {
      const ts = new TimeSignature(3, 4)
      const ks = new KeySignature()
      const p = new Partition(ts, ks, 90)
      expect(p.signature).toBe(ts)
      expect(p.key).toBe(ks)
      expect(p.bpm).toBe(90)
    })
  })

  describe('addStaff', () => {
    it('adds a staff', () => {
      const p = makePartition()
      p.addStaff()
      expect(p.staves.length).toBe(1)
    })

    it('adds multiple staves', () => {
      const p = makePartition()
      p.addStaff()
      p.addStaff()
      p.addStaff()
      expect(p.staves.length).toBe(3)
    })
  })

  describe('addMeasure', () => {
    it('appends a measure column with the partition defaults', () => {
      const p = makePartition(4, 4, 120)
      p.addMeasure()
      expect(p.measureColumns.length).toBe(1)
      expect(p.measureColumns[0].bpm).toBe(120)
      expect(p.measureColumns[0].masterTimeSignature.toString()).toBe('4/4')
    })

    it('creates corresponding measures in all staves', () => {
      const p = makePartition()
      p.addStaff()
      p.addStaff()
      p.addMeasure()
      p.addMeasure()
      expect(p.staves[0].measures.length).toBe(2)
      expect(p.staves[1].measures.length).toBe(2)
    })
  })

  describe('insertNewMeasureAt', () => {
    it('inserts at the beginning', () => {
      const p = makePartition(4, 4, 120)
      p.addMeasure()
      p.insertNewMeasureAt(0)
      expect(p.measureColumns.length).toBe(2)
      // First measure (inserted) uses partition defaults since index is 0
      // and there's no predecessor
      expect(p.measureColumns[0].bpm).toBe(120)
    })

    it('inherits time signature and bpm from the previous column', () => {
      const p = makePartition(4, 4, 120)
      p.addMeasure()
      // Manually alter the first column's bpm
      p.measureColumns[0].bpm = 90
      p.insertNewMeasureAt(1)
      expect(p.measureColumns[1].bpm).toBe(90)
    })

    it('inserts measures into all staves at the matching index', () => {
      const p = makePartition()
      p.addStaff()
      p.addMeasure()
      p.addMeasure()
      const originalFirst = p.staves[0].measures[0]
      p.insertNewMeasureAt(0)
      expect(p.staves[0].measures.length).toBe(3)
      // The original first measure should now be at index 1
      expect(p.staves[0].measures[1]).toBe(originalFirst)
    })

    it('throws for non-integer index', () => {
      const p = makePartition()
      expect(() => p.insertNewMeasureAt(0.5)).toThrow('index must be an integer')
    })

    it('throws for negative index', () => {
      const p = makePartition()
      expect(() => p.insertNewMeasureAt(-1)).toThrow('index out of bounds')
    })

    it('throws for index beyond column count', () => {
      const p = makePartition()
      expect(() => p.insertNewMeasureAt(1)).toThrow('index out of bounds')
    })
  })
})
