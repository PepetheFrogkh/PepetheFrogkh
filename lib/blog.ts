import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale } from './i18n'

/**
 * Les articles du blog.
 *
 * Un fichier MDX par article, dans `content/blog/fr` ou `content/blog/en` :
 * on ecrit, on pousse, l'article est en ligne. Rien a declarer ailleurs, pas
 * de base de donnees, pas d'interface d'administration.
 *
 * La lecture se fait au moment de la construction, donc les articles sont des
 * pages statiques comme les autres.
 */

export interface Article {
  slug: string
  /** Le titre de la page, affiche en h1. */
  title: string
  /**
   * Le titre court du `<title>`, suffixe de marque non compris : 60 caracteres
   * au plus, le h1 etant souvent plus long. A defaut, le h1 sert de titre.
   */
  seoTitle: string
  /**
   * La meta description, 110 a 160 caracteres. A defaut, le chapo sert de
   * description, au risque d'etre tronque dans les resultats de recherche.
   */
  description: string
  /** Le chapo, affiche sous le titre. */
  summary: string
  /** Au format ISO, pour que le tri et le flux RSS soient d'accord. */
  date: string
  tags: string[]
  draft: boolean
  /** Le corps en Markdown, tel quel. */
  body: string
  /** Le temps de lecture en minutes, arrondi au minimum a une. */
  minutes: number
}

const ROOT = path.join(process.cwd(), 'content', 'blog')

/** 200 mots par minute : la moyenne admise pour une lecture a l'ecran. */
function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function parse(slug: string, raw: string): Article {
  const { data, content } = matter(raw)
  const title = String(data.title ?? slug)
  const summary = String(data.summary ?? '')
  return {
    slug,
    title,
    seoTitle: String(data.seoTitle ?? title),
    description: String(data.description ?? summary),
    summary,
    date: String(data.date ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: data.draft === true,
    body: content,
    minutes: readingTime(content),
  }
}

/** Tous les articles publies d'une langue, du plus recent au plus ancien. */
export async function articles(locale: Locale): Promise<Article[]> {
  let files: string[]
  try {
    files = await readdir(path.join(ROOT, locale))
  } catch {
    // pas encore de dossier : pas encore d'articles, et ce n'est pas une erreur
    return []
  }

  const all = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const raw = await readFile(path.join(ROOT, locale, file), 'utf8')
        return parse(file.replace(/\.mdx$/, ''), raw)
      }),
  )

  return all
    .filter((article) => !article.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Un article, ou `null` s'il n'existe pas ou s'il est en brouillon. */
export async function article(locale: Locale, slug: string): Promise<Article | null> {
  return (await articles(locale)).find((item) => item.slug === slug) ?? null
}

/** Tous les themes rencontres, pour les filtres de la page liste. */
export async function topics(locale: Locale): Promise<string[]> {
  const list = await articles(locale)
  return [...new Set(list.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b))
}
