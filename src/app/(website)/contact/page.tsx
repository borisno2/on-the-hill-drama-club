import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'
import Link from 'next/link'

export const metadata: Metadata = {
  ...getMetadata('Contact Us'),
}

export default function Page() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="divide-y-2 divide-gray-200">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
              Get in touch
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:col-span-2 lg:mt-0">
              <div>
                <dl className="mt-2 text-base text-gray-500">
                  <div>
                    <dt>Email</dt>
                    <dd>hello@opensaas.au</dd>
                  </div>
                  <div className="mt-1">
                    <dt>Phone Number</dt>
                    <dd>04XX XXX XXX</dd>
                  </div>
                  <div className="mt-1">
                    <dt>Address</dt>
                    <dd>
                      <Link
                        href="https://opensaas.au"
                        className="text-blue-800"
                      >
                        www.opensaas.au
                      </Link>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
