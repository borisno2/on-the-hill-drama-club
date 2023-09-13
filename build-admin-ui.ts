import { cli } from '@keystone-6/core/scripts/cli'

// This is a workaround for keystone's next build not exiting
// we want to just build the admin ui and exit the process
// we then use next build cli directly in package.json scripts for the next build
async function main() {
    try {
        await cli(__dirname, ['build'])
    } catch (error) {
        // swallow error
    } finally {
        process.exit(0)
    }
}
main()