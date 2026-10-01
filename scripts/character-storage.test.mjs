import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { readCharacters, storeCharacter } from '../src/utils/characterStorage.mjs'

beforeEach(() => {
  const storage = new Map()
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }
})

const hero = id => ({ id, name: id, updatedAt: 1 })

test('allows six characters, rejects a seventh, and still saves edits', () => {
  for (let id = 1; id <= 6; id++) assert.equal(storeCharacter(hero(id)).length, id)
  assert.equal(storeCharacter(hero(7)), null)
  assert.equal(storeCharacter({ ...hero(3), name: 'Updated' }).length, 6)
  assert.equal(readCharacters().find(item => item.id === 3).name, 'Updated')
})

test('deleting a character makes room for a replacement', () => {
  for (let id = 1; id <= 6; id++) storeCharacter(hero(id))
  localStorage.setItem('mag-playable-characters-v1', JSON.stringify(readCharacters().filter(item => item.id !== 2)))
  assert.equal(storeCharacter(hero(7)).length, 6)
})

test('preserves oversized legacy libraries while preventing new additions', () => {
  const legacy = Array.from({ length: 8 }, (_, id) => hero(id))
  localStorage.setItem('mag-playable-characters-v1', JSON.stringify(legacy))
  assert.equal(storeCharacter(hero(9)), null)
  assert.equal(storeCharacter({ ...hero(1), name: 'Updated' }).length, 8)
  assert.equal(readCharacters().find(item => item.id === 1).name, 'Updated')
})
