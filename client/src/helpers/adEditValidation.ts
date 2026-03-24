import type { AdEditFormState, Category } from '../types'

export const isPriceFilled = (price: string) => {
  const n = Number(price)
  return price.trim() !== '' && Number.isFinite(n) && n >= 0
}

export const isTypeFilled = (category: Category, form: AdEditFormState) => {
  if (category === 'electronics') return form.electronicsParams.type !== ''
  if (category === 'real_estate') return form.realEstateParams.type !== ''
  return true
}

export const canSaveAdEdit = (form: AdEditFormState) =>
  form.title.trim().length > 0 && isPriceFilled(form.price) && isTypeFilled(form.category, form)
