import { Context } from '.keystone/types'
import { SessionStrategy } from '@keystone-6/core/types'
import { getSession as getNextAuthSession } from 'next-auth/react'

import * as Path from 'path'


import { config } from '@keystone-6/core'

import { lists } from './src/keystone/schema'

const session: SessionStrategy<any> = {
	get: async ({context}) => {
		const { req, res } = context
		if (!req || !res) return null
		return (await getNextAuthSession({ req })) as Context['session']
	},
	start: async () => {
		console.log('session start not used');
	
	},
	end: async () => {
		console.log('session end not used');
	}
}

export default config({
	db: {
		provider: 'mysql',
		url: process.env.DATABASE_URL || 'mysql://root:my-secret-pw@localhost:50968/onthehilldrama',
		additionalPrismaDatasourceProperties: {
			referentialIntegrity: 'prisma'
		},
		useMigrations: true,
		prismaPreviewFeatures: ['referentialIntegrity'],
	},
	ui: {
		getAdditionalFiles: [
			async () => [
				{
					mode: 'copy',
					inputPath: Path.resolve('./next-config.js'),
					outputPath: 'next.config.js',
				},
			],
		],
	},
	server: {
		port: 4000,
	},
	lists,
	session,
})
