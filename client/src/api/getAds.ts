import { api } from "./axios"
import type { Ad, GetAdsParams, ApiListItem, ApiItemDetails, AdDetails } from "../types"
import { getMissingFields } from "../helpers/adValidators"
import { getFallbackTitle, pickImageUrls } from "../helpers/adMappers"

export const getAds = async ({limit,
                              skip,
                              q,
                              categories,
                              needsRevision,
                              sortColumn,
                              sortDirection,
                            }: GetAdsParams = {}): Promise<{ items: Ad[]; total: number }> => {
  const params: Record<string, unknown> = {}
  if (limit !== undefined) params.limit = limit
  if (skip !== undefined) params.skip = skip
  if (q?.trim()) params.q = q.trim()
  if (categories?.length) params.categories = categories.join(',')
  if (needsRevision) params.needsRevision = true
  if (sortColumn) params.sortColumn = sortColumn
  if (sortDirection) params.sortDirection = sortDirection

  const { data } = await api.get("/items", { params })

  return {
    ...data,
    items: data.items.map((item: ApiListItem, index: number) => {
      const id = item.id

      if (typeof id !== 'number' || !Number.isInteger(id) || id <= 0) {
        throw new Error(`Сервер вернул объявление без корректного id на позиции ${index}`)
      }

      return {
        title: item.title,
        price: item.price,
        category: item.category,
        needsRevision: item.needsRevision,
        missingFields: [],
        imageUrl: item.imageUrl ?? item.image ?? item.photoUrl ?? item.photo,
        id,
      }
    }),
  }
}

export const getAdById = async (id: number): Promise<AdDetails> => {
  const { data } = await api.get<ApiItemDetails>(`/items/${id}`)
  const missingFields = getMissingFields(data)
  const imageUrls = pickImageUrls(data)

  return {
    id: data.id ?? id,
    title: data.title?.trim() || getFallbackTitle(id),
    description: data.description?.trim() || '',
    price: typeof data.price === 'number' ? data.price : null,
    createdAt: data.createdAt ?? '',
    updatedAt: data.updatedAt ?? '',
    category: data.category,
    params: data.params ?? {},
    needsRevision: missingFields.length > 0,
    missingFields,
    imageUrl: imageUrls[0],
    imageUrls,
  }
}