import { api } from "./axios"
import type { Ad, GetAdsParams, ApiListItem, ApiItemDetails } from "../types"

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0

const getMissingFields = (item: ApiItemDetails): string[] => {
  const missingFields: string[] = []
  const params = item.params ?? {}

  if (!isNonEmptyString(item.description)) {
    missingFields.push('Описание')
  }

  if (item.category === 'auto') {
    if (!isNonEmptyString(params.brand)) missingFields.push('Марка')
    if (!isNonEmptyString(params.model)) missingFields.push('Модель')
    if (!isPositiveNumber(params.yearOfManufacture)) missingFields.push('Год выпуска')
    if (!(params.transmission === 'automatic' || params.transmission === 'manual')) {
      missingFields.push('Коробка передач')
    }
    if (!isPositiveNumber(params.mileage)) missingFields.push('Пробег')
    if (!isPositiveNumber(params.enginePower)) missingFields.push('Мощность двигателя')
    return missingFields
  }

  if (item.category === 'real_estate') {
    if (!(params.type === 'flat' || params.type === 'house' || params.type === 'room')) {
      missingFields.push('Тип недвижимости')
    }
    if (!isNonEmptyString(params.address)) missingFields.push('Адрес')
    if (!isPositiveNumber(params.area)) missingFields.push('Площадь')
    if (!isPositiveNumber(params.floor)) missingFields.push('Этаж')
    return missingFields
  }

  if (!(params.type === 'phone' || params.type === 'laptop' || params.type === 'misc')) {
    missingFields.push('Тип устройства')
  }
  if (!isNonEmptyString(params.brand)) missingFields.push('Бренд')
  if (!isNonEmptyString(params.model)) missingFields.push('Модель')
  if (!(params.condition === 'new' || params.condition === 'used')) {
    missingFields.push('Состояние')
  }
  if (!isNonEmptyString(params.color)) missingFields.push('Цвет')
  return missingFields
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
    items: await Promise.all(
      data.items.map(async (item: ApiListItem, index: number) => {
        const id = safeSkip + index + 1

        try {
          const { data: details } = await api.get<ApiItemDetails>(`/items/${id}`)
          const missingFields = getMissingFields(details)
          return {
            title: item.title,
            price: item.price,
            category: item.category,
            needsRevision: missingFields.length > 0,
            missingFields,
            imageUrl: item.imageUrl ?? item.image ?? item.photoUrl ?? item.photo,
            id,
          }
        } catch {
          return {
            title: item.title,
            price: item.price,
            category: item.category,
            needsRevision: item.needsRevision,
            missingFields: item.needsRevision ? ['Не удалось получить детали объявления'] : [],
            imageUrl: item.imageUrl ?? item.image ?? item.photoUrl ?? item.photo,
            id,
          }
        }
      }),
    ),
  }
}