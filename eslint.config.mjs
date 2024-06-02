// import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import imprt from 'eslint-plugin-import' // 'import' is ambiguous & prettier has trouble
import { fixupConfigRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default [
  ...fixupConfigRules(compat.extends('plugin:@next/next/core-web-vitals')),
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      // '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      // ...hooksPlugin.configs.recommended.rules,
      // ...nextPlugin.configs.recommended.rules,
      // ...nextPlugin.configs['core-web-vitals'].rules,
      // '@next/next/no-img-element': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      import: imprt,
      '@typescript-eslint': ts,
      ts,
    },
    rules: {
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,
      'ts/return-await': 2,
    },
  },
  {
    ignores: ['**/.next/'],
  },
]
