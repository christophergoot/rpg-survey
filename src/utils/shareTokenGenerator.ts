import { customAlphabet } from 'nanoid'

// Create a custom nanoid generator with a URL-safe alphabet
// Excludes similar looking characters (0/O, 1/I/l)
const nanoid = customAlphabet(
  '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz',
  10
)

/**
 * Generates a unique share token for survey URLs
 * Example output: "a3fK9mP2xR"
 */
export const generateShareToken = (): string => {
  return nanoid()
}
