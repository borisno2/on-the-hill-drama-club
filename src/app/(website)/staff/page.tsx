import { Container } from 'components/Container'

import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import { StaffBio } from 'components/StaffBio'

export const metadata: Metadata = {
  ...getMetadata('About'),
}

export default function Page() {
  return (
    <Container className="mt-9">
      <StaffBio />
    </Container>
  )
}
