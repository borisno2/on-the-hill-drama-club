import { getSessionContext } from "keystone/context";
import StudentForm from "../StudentForm"
import DashboardLayout from "../../DashboardLayout"


export default async function NewStudent() {
    const context = await getSessionContext();
    const { accountId } = context.session.data

    return (
        <DashboardLayout PageName="Students">
            <div className="py-4">
                <StudentForm accountId={accountId} />
            </div>
        </DashboardLayout>
    )
}
