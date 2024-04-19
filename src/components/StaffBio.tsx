/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/j21zSbLekUT
 */
import { graphql } from 'gql'
import { AvatarImage, AvatarFallback, Avatar } from 'components/ui/avatar'
import { HoverCardTrigger, HoverCard } from 'components/ui/hover-card'
import { keystoneContext } from 'keystone/context'

const GET_STAFF_QUERY = graphql(`
  query GetStaff {
    teachers {
      id
      name
      position
      bio
      image {
        id
        url
      }
    }
  }
`)

export async function StaffBio() {
  const { teachers } = await keystoneContext.graphql.run({
    query: GET_STAFF_QUERY,
  })
  return (
    <section className="flex flex-col items-center justify-center space-y-8 bg-[#ffffff] px-4 py-8 dark:bg-[#000000] md:space-y-16 md:px-6 md:py-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Our Teachers</h2>
        <p className="text-gray-500 dark:text-gray-400 md:text-lg">
          Meet our team of teachers who are passionate about what they do.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
        {teachers?.map(({ id, name, position, bio, image }) =>
          !bio && !image?.url ? null : (
            <HoverCard key={id}>
              <HoverCardTrigger asChild>
                <div className="flex flex-row items-center gap-4 md:gap-8">
                  <Avatar className="h-32 w-24 md:h-40 md:w-32">
                    <AvatarImage
                      alt={`Image of Teacher ${name}`}
                      src={image?.url}
                    />
                    <AvatarFallback>{`${name?.[0]}${
                      name?.split(' ')?.[1]?.[0] || ''
                    }`}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold">{name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {position}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {bio}
                    </p>
                  </div>
                </div>
              </HoverCardTrigger>
            </HoverCard>
          ),
        )}
      </div>
    </section>
  )
}
