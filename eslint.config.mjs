// @ts-check
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const patchedConfig = fixupConfigRules([
  ...compat.extends('next/core-web-vitals'),
])

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...patchedConfig,
  {
    ignores: [
      '**/.next/',
      'node_modules',
      '__generated__',
      '**/.keystone',
      '*.js',
    ],
  },
)
