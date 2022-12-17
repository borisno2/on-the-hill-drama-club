import DashboardLayout from "../../DashboardLayout"


export default function Students({ ...pageProps }) {

    return (
        <DashboardLayout PageName="Students" {...pageProps}><div className="py-4">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
        </div>
        </DashboardLayout>
    )
}
