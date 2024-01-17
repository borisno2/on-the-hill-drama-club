import { Container } from 'components/Container'
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

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
                    <dd>emily@emilycalder.com.au</dd>
                  </div>
                  <div className="mt-1">
                    <dt>Phone Number</dt>
                    <dd>0409 865 249</dd>
                  </div>
                  <div className="mt-1">
                    <dt>Address</dt>
                    <dd>Unit 23/11 Hopetoun St, Bendigo, 3550</dd>
                  </div>
                </dl>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.5334495934203!2d144.28227157640822!3d-36.75776827442919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad759b77b654865%3A0xda21df911087d583!2sEmily%20Calder&#39;s%20School%20of%20Performing%20Arts!5e0!3m2!1sen!2sau!4v1705451176745!5m2!1sen!2sau"
                  width="600"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
