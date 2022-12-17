import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.url.startsWith('/admin')) {
        return token?.role === 'admin'
      }
      return !!token
    },
  },
})

export const config = { matcher: ['/admin', '/dashboard'] }
