export const CHARACTER_LIMIT = 6
export const CHARACTER_LIMIT_MESSAGE = 'The portfolio version supports up to 6 characters. Delete a saved Hero before creating or importing another.'
const STORE_KEY = 'mag-playable-characters-v1'

export function readCharacters() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch { return [] }
}

export function canSaveCharacter(characters, id) {
  return characters.length < CHARACTER_LIMIT || characters.some(hero => hero.id === id)
}

export function storeCharacter(character) {
  const characters = readCharacters()
  if (!canSaveCharacter(characters, character.id)) return null
  const next = [...characters.filter(hero => hero.id !== character.id), character].sort((a, b) => b.updatedAt - a.updatedAt)
  localStorage.setItem(STORE_KEY, JSON.stringify(next))
  return next
}
