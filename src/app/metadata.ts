import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  title: 'On the Hill Drama Club',
  description:
    'On the Hill Drama Club - A demonstration site for Next.js and KeystoneJS',
}

export function getMetadata(page: string): Metadata {
  return {
    ...baseMetadata,
    title: `${page} - ${baseMetadata.title}`,
    description: `${page} - ${baseMetadata.description}`,
  }
}
