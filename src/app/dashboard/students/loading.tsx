import DashboardLayout from '../DashboardLayout'

export default function Loading() {
  return (
    <DashboardLayout PageName="Students">
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl font-medium">Loading...</p>
      </div>
    </DashboardLayout>
  )
}
