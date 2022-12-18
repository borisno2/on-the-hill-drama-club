import { gql } from "@ts-gql/tag/no-transform";
import { getSessionContext } from "app/KeystoneContext";
import ProfileForm from "components/ProfileForm"
import { redirect } from "next/navigation";
import DashboardLayout from "../../DashboardLayout"

const GET_ACCOUNT = gql`
    query GET_ACCOUNT($id: ID!) {
        user(where: { id: $id }) {
            id
            name
            email
            account {
                id
                firstName
                surname
                phone
                streetAddress
                suburb
                postcode
            }
        }
    }
`as import("../../../../../__generated__/ts-gql/GET_ACCOUNT").type

export default async function Profile() {
    const context = await getSessionContext();
    const { id } = context.session.data
    const { user } = await context.graphql.run({ query: GET_ACCOUNT, variables: { id: id } })
    if (!user || !user.account) {
        redirect('/dashboard/new-account')
    }

    const profile = {
        email: user.email,
        ...user.account,

    }

    return (
        <DashboardLayout PageName="Profile">
            <div className="py-4">
                <ProfileForm user={profile} />
            </div>
        </DashboardLayout>
    )
}
