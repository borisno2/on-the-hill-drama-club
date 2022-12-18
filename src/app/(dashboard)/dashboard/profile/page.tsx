import { getSessionContext } from "app/KeystoneContext";
import ProfileForm from "components/ProfileForm"
import DashboardLayout from "../../DashboardLayout"


export default async function Profile() {
    const context = await getSessionContext();
    const user = context.session.data

    return (
        <DashboardLayout PageName="Profile">
            <div className="py-4">
                <ProfileForm user={user} />
            </div>
        </DashboardLayout>
    )
}
