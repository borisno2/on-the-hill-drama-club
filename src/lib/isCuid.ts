export function isCuid(stringToCheck: string): boolean {
  if (typeof stringToCheck !== 'string') return false
  if (stringToCheck.startsWith('c')) return true
  return false
}
