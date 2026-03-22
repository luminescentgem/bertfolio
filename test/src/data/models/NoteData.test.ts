import NoteData from '@/src/data/models/NoteData'
import { describe, it, expect } from 'vitest'

describe('NoteData', () => {
  it('has null defaults for all fields', () => {
    const nd = new NoteData()
    expect(nd.title).toBeNull()
    expect(nd.link).toBeNull()
    expect(nd.summary).toBeNull()
    expect(nd.imageUrl).toBeNull()
  })

  it('accepts all fields via constructor', () => {
    const nd = new NoteData('Test', 'https://x.com', 'A summary', 'https://x.com/img.png')
    expect(nd.title).toBe('Test')
    expect(nd.link).toBe('https://x.com')
    expect(nd.summary).toBe('A summary')
    expect(nd.imageUrl).toBe('https://x.com/img.png')
  })

  it('accepts partial constructor args', () => {
    const nd = new NoteData('Title only')
    expect(nd.title).toBe('Title only')
    expect(nd.link).toBeNull()
  })
})
