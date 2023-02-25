import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  title: 'Emily Calder - School of Performing Arts',
  description:
    'Emily Calder - School of Performing Arts - Teaching Theatre and Music in the Bendigo Region',
  viewport: 'width=device-width, initial-scale=1.0',
}

export function getMetadata(page: string): Metadata {
  return {
    ...baseMetadata,
    title: `${page} - ${baseMetadata.title}`,
    description: `${page} - ${baseMetadata.description}`,
  }
}
