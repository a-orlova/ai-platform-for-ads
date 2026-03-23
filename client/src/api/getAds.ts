import { api } from "./axios"
import type { Ad } from "../types"

type GetAdsParams = {
  q?: string
  limit?: number
  skip?: number
  categories?: Array<'auto' | 'electronics' | 'real_estate'>
  needsRevision?: boolean
  sortColumn?: 'title' | 'createdAt'
  sortDirection?: 'asc' | 'desc'
}

type ApiListItem = {
  title: string
  price: number
  category: string
  needsRevision: boolean
  imageUrl?: string
  image?: string
  photoUrl?: string
  photo?: string
}

export const getAds = async ({limit,
                              skip,
                              q,
                              categories,
                              needsRevision,
                              sortColumn,
                              sortDirection,
                            }: GetAdsParams = {}): Promise<{ items: Ad[]; total: number }> => {
  const params: any = {}
  if (limit !== undefined) params.limit = limit
  if (skip !== undefined) params.skip = skip
  if (q?.trim()) params.q = q.trim()
  if (categories?.length) params.categories = categories.join(',')
  if (needsRevision) params.needsRevision = true
  if (sortColumn) params.sortColumn = sortColumn
  if (sortDirection) params.sortDirection = sortDirection

  const { data } = await api.get("/items", { params })
  const safeSkip = skip ?? 0

  return {
    ...data,
    items: data.items.map((item: ApiListItem, index: number) => ({
      title: item.title,
      price: item.price,
      category: item.category,
      needsRevision: item.needsRevision,
      imageUrl: item.imageUrl ?? item.image ?? item.photoUrl ?? item.photo,
      id: safeSkip + index + 1,
    })),
  }
}