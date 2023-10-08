import Link from 'next/link'
export default function Component() {
  return (
    <>
      <Link
        className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
        href="/dashboard"
      >
        Student Portal
      </Link>
    </>
  )
}
