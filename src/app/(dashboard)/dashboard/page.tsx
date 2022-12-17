import { getSessionContext } from "app/KeystoneContext";
import DashboardLayout from "../DashboardLayout"


export default async function Portal() {
    const context = await getSessionContext();
    const users = await context.db.User.findMany()

    return (
        <DashboardLayout PageName="Dashboard">
            <div className="py-4">
                <p>{JSON.stringify(users)}</p>
            </div>
        </DashboardLayout>
    )
}
