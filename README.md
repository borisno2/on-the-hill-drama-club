# On the Hill Drama Club

Emily is a String and Theatre teacher in Bendigo, Victoria, Australia. Her Drama Club at [The Old Church on the Hill](https://www.theoldchurch.org.au) has grown to now have more students than her old faithful pen and paper can handle. Being both her husband and a developer on the [Keystone](https://www.keystonejs.com) project at [Thinkmill](https://www.thinkmill.com.au) I figured I could help make her life a little bit easier by streamlining the enrolment, communication, and billing, while at the same time exploring new tech and new ways of working with Keystone. So over Christmas 2022, I started putting together this Website which serves as both a marketing site and a student portal.

## What it does (function)

The project allows students and their parents/guardians to view the timetable, check fees, see class availability and enroll through the Student Portal/Dashboard. Once enrolled they click enroll in their dashboard, the enrolment is set to `Pending`, then Emily can confirm their enrolment by setting its status to `Enroled`. Once the status is set to `Enroled` a confirmation email is sent to the account owner with the time and start date pulled from the `Lesson` and `Term`.

We use Xero for bookkeeping, we can generate invoices for the Term which creates them in Xero ready to send.

## Tech Stack

I wanted to try something new, have a super easy deployment experience, and not have the headache of looking after servers.

With that in mind, I went with the following

### Keystone - In Next using `getContext`

This was a fairly obvious choice for me, I spend my work days developing so know it fairly well, and it also provides a pretty awesome backend application framework. With the new `getContext` API, I also don't need to run a server any more. I am still using Apollo Server but deployed through the frontend NextJS app.

### NextJS `/app` Directory

As I said I was keen on trying something new, the app directory/server side react components along with `getContext` make page building and data fetching much more straightforward.

### NextAuth

This provides a quick way of getting Auth working especially when one of the requirements was social auth.

### Neon DB

I was using PlanetScale as their schema branching was something I really wanted to give a go, but since they have dropped their free tier I have moved to Neon.

### Others to note

- Tailwind both some UI components and CSS
- Inngest - for backgrounding tasks, especially for generating invoices based on events.

# Give it a Go.

You can see the dev environment on Vercel at [emily-calder.vercel.app](https://emily-calder.vercel.app) - it does only have test data - feel free to register and give it a go. The production site is at [www.emilycalder.com.au](https://www.emilycalder.com.au) - feel free to check it out, but please don't enroll unless you are interested in having lessons in Bendigo (and get the bill for it).

You can try it out on Dev by cloning the repo and running `pnpm install` and `pnpm dev` which will start two nextjs dev servers, one hosting the main site including the GraphQL API on port `3000` and one hosting the Keystone Admin UI on port `4000`, the Keystone UI is proxied through the frontend at `/admin`.
