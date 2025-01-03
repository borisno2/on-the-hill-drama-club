# On the Hill Drama Club - Demo Site

Welcome to the On the Hill Drama Club demo site! This project demonstrates how to build a modern web application using Next.js App Directory alongside KeystoneJS, showcasing best practices for both technologies.

The site is inspired by a real-world use case: Emily, a passionate string and theatre teacher based in Bendigo, Victoria, Australia. Emily’s drama club at The Old Church on the Hill grew beyond what pen and paper could handle. To support her growing club, this platform was developed to streamline enrolments, communication, and billing, while also exploring cutting-edge tools and workflows.

Developed by Josh Calder at [OpenSaasAU](https://opensaas.au) this demo now serves as both a technical showcase and an example of how KeystoneJS can power dynamic, content-driven sites with custom admin interfaces, and is the basis of my [YouTube how-to series](https://youtube.com/playlist?list=PL6uX-qEY8TlcvaG33aMLVp-ICm2TL0qcn&si=SP8W6wmn0wuhUTnf)

Features
• Next.js App Directory: Leverage the latest routing and server components.
• KeystoneJS: Simplified content management and custom workflows.
• Real-World Application: Focus on usability for small organizations or clubs.

## What it does (function)

The project allows students and their parents/guardians to view the timetable, check fees, see class availability and enroll through the Student Portal/Dashboard. Once enrolled they click enroll in their dashboard, the enrolment is set to `Pending`, then Emily can confirm their enrolment by setting its status to `Enroled`. Once the status is set to `Enroled` a confirmation email is sent to the account owner with the time and start date pulled from the `Lesson` and `Term`.

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

You can see the demo environment on hosted on Vercel at [onthehill.opensaas.au](https://onthehill.opensaas.au) - it does only have test data - feel free to register and give it a go.

You can try it out on Dev by cloning the repo and running `pnpm install` and `pnpm dev` which will start two nextjs dev servers, one hosting the main site including the GraphQL API on port `3000` and one hosting the Keystone Admin UI on port `4000`, the Keystone UI is proxied through the frontend at `/admin`.
