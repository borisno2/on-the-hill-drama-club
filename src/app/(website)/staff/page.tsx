import { Container } from 'components/Container'

import Images from 'app/(home)/Images'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import { StaffBio } from 'components/staff-bio'

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
