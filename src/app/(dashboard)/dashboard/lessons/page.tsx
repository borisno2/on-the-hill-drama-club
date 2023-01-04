import DashboardLayout from "../../DashboardLayout"
import ClassList from "./LessonList"
import { getSessionContext } from "app/KeystoneContext";
import { GET_STUDENTS } from "../students/queries";
import { LessonTermWhereInput } from "../../../../../__generated__/ts-gql/@schema";


export default async function lessons() {
    const context = await getSessionContext();
    const { students } = await context.graphql.run({ query: GET_STUDENTS })
    // get a list of students year levels
    const yearLevels = students ? students.map(student => student.yearLevel) : []
    const studentIds = students ? students.map(student => student.id) : []
    // remove duplicates
    const uniqueYearLevels = [...new Set(yearLevels)]
    // create a class where clause to filter lessons by year level
    let availableWhere: LessonTermWhereInput = {}
    if (uniqueYearLevels.length > 0) {
        availableWhere = {
            lesson: { OR: uniqueYearLevels.map(yearLevel => ({ AND: [{ maxYear: { gte: yearLevel } }, { minYear: { lte: yearLevel } }] })) }
        }
        // create a class where clause to filter lessons by student id
        let enroledWhere: LessonTermWhereInput = {}
        if (studentIds.length > 0) {
            enroledWhere = { enrolments: { some: { student: { id: { in: studentIds } } } } }
        }
    }

    return (
        <DashboardLayout PageName="Lessons">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <h2 className="text-2xl font-bold text-gray-900">Enroled Lessons</h2>
                    {/* @ts-expect-error Server Component */}
                    <ClassList where={enroledWhere} enroled={false} />
                </div>
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">

                    <h2 className="text-2xl font-bold text-gray-900">Available Lessons</h2>
                    {/* @ts-expect-error Server Component */}
                    <ClassList where={availableWhere} enroled={false} />
                </div>
            </div>
        </DashboardLayout>
    )
}
