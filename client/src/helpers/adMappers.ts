import type { ApiItemDetails } from '../types'

export const getFallbackTitle = (id: number) => `Объявление #${id}`

export const pickImageUrls = (item: ApiItemDetails): string[] => {
  const candidates = [
    ...(Array.isArray(item.imageUrls) ? item.imageUrls : []),
    ...(Array.isArray(item.images) ? item.images : []),
    ...(Array.isArray(item.photoUrls) ? item.photoUrls : []),
    ...(Array.isArray(item.photos) ? item.photos : []),
    item.imageUrl,
    item.image,
    item.photoUrl,
    item.photo,
  ]

  return Array.from(
    new Set(
      candidates.filter((value): value is string => typeof value === 'string' && value.trim().length > 0),
    ),
  )
}
