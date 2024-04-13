export function formatDate(dateString: string | null | undefined) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
