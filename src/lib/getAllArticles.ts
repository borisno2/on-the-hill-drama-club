import glob from 'fast-glob'
import * as path from 'path'
import { ReactElement } from 'react'

export type Article = {
  slug: string
  component: ReactElement<any>
  date: string
  title: string
  description: string
}
async function importArticle(articleFilename: string): Promise<Article> {
  let { meta, default: component } = await import(
    `../pages/articles/${articleFilename}`
  )
  return {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    ...meta,
    component,
  }
}

export async function getAllArticles(): Promise<Article[]> {
  let articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/articles'),
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => parseInt(new Date(z.date).toISOString())- parseInt(new Date(a.date).toISOString()))
}
