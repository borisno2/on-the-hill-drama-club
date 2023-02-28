import { gql } from "@ts-gql/tag/no-transform";
import { getSessionContext } from "keystone/context";
import ProfileForm from "./ProfileForm"
import { redirect } from "next/navigation";
import DashboardLayout from "../DashboardLayout"
import type { Metadata } from 'next'
import { getMetadata } from 'app/metadata'

export const metadata: Metadata = {
    ...getMetadata('Profile - Student Portal'),
}

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
                secondContactName
                secondContactPhone
            }
        }
    }
`as import("../../../../__generated__/ts-gql/GET_ACCOUNT").type

export default async function Profile({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }; }) {
    let redirectOnSave: boolean = false
    if (searchParams?.incomplete === 'true') {
        redirectOnSave = true
    }
    const context = await getSessionContext();
    const { userId } = context.session
    const { user } = await context.graphql.run({ query: GET_ACCOUNT, variables: { id: userId } })
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
                <ProfileForm user={profile} redirectOnSave={redirectOnSave} />
            </div>
        </DashboardLayout>
    )
}
