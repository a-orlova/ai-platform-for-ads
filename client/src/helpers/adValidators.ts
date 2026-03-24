import type { ApiItemDetails } from '../types'

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const isPositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0

export const getMissingFields = (item: ApiItemDetails): string[] => {
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
