import DashboardLayout from "../../DashboardLayout"
import ClassList from "./ClassList"
import { getSessionContext } from "app/KeystoneContext";
import { GET_STUDENTS } from "../students/queries";
import { ClassWhereInput } from "../../../../../__generated__/ts-gql/@schema";


export default async function Classess() {
    const context = await getSessionContext();
    const { students } = await context.graphql.run({ query: GET_STUDENTS })
    // get a list of students year levels
    const yearLevels = students ? students.map(student => student.yearLevel) : []
    // remove duplicates
    const uniqueYearLevels = [...new Set(yearLevels)]
    // create a class where clause to filter classes by year level
    let where: ClassWhereInput = {}
    if (uniqueYearLevels.length > 0) {
        where = { OR: uniqueYearLevels.map(yearLevel => ({ AND: [{ maxYear: { lt: yearLevel } }, { minYear: { gt: yearLevel } }] })) }
    }

    return (
        <DashboardLayout PageName="Classes">
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ClassList where={where} />
            </div>
        </DashboardLayout>
    )
}
