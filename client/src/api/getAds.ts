import { api } from "./axios"
import type { Ad } from "../types"

type GetAdsParams = {
  limit?: number
  skip?: number
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

export const getAds = async ({ limit, skip }: GetAdsParams = {}): Promise<{ items: Ad[]; total: number }> => {
  const params: any = {}
  if (limit !== undefined) params.limit = limit
  if (skip !== undefined) params.skip = skip

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