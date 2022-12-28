import { getSessionContext } from "app/KeystoneContext";
import StudentForm from "components/StudentForm"
import DashboardLayout from "../../../DashboardLayout"


export default async function NewStudent() {

    return (
        <DashboardLayout PageName="Students">
            <div className="py-4">
                <StudentForm />
            </div>
        </DashboardLayout>
    )
}
