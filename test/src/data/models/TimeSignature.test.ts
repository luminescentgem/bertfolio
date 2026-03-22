import { describe, it, expect } from 'vitest'
import TimeSignature from '@/src/data/models/TimeSignature'

describe('TimeSignature', () => {
  it('defaults to 4/4', () => {
    const ts = new TimeSignature()
    expect(ts.n).toBe(4)
    expect(ts.d).toBe(4)
  })

  it('accepts custom numerator and denominator', () => {
    const ts = new TimeSignature(3, 8)
    expect(ts.n).toBe(3)
    expect(ts.d).toBe(8)
  })

  it('throws when denominator is not a power of 2', () => {
    expect(() => new TimeSignature(4, 3)).toThrow()
    expect(() => new TimeSignature(4, 5)).toThrow()
    expect(() => new TimeSignature(4, 6)).toThrow()
    expect(() => new TimeSignature(7, 12)).toThrow()
  })

  it('accepts all standard power-of-2 denominators', () => {
    for (const d of [1, 2, 4, 8, 16, 32]) {
      expect(() => new TimeSignature(4, d)).not.toThrow()
    }
  })

  it('toString returns "n/d"', () => {
    expect(new TimeSignature(4, 4).toString()).toBe('4/4')
    expect(new TimeSignature(6, 8).toString()).toBe('6/8')
    expect(new TimeSignature(3, 4).toString()).toBe('3/4')
  })

  it('toArray returns [n, d]', () => {
    const ts = new TimeSignature(7, 8)
    expect(ts.toArray()).toEqual([7, 8])
  })
})
