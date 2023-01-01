import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (new URL(req.url).pathname.startsWith('/admin')) {
        return !!token?.allowAdminUI
      }
      return !!token
    },
  },
})

export const config = { matcher: ['/admin', '/dashboard'] }
