import { useSession, signIn, signOut } from 'next-auth/react'
export default function Component() {
	const { data: session } = useSession()
	if (session) {
		return (
			<>
				<button className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900" onClick={() => signOut()}>Sign out</button>
			</>
		)
	}
	return (
		<>
			<button className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900" onClick={() => signIn('auth0')}>Sign in</button>
		</>
	)
}