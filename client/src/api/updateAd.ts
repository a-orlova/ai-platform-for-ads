import { api } from './axios'
import type { AdEditFormState } from '../types'
import { mapAdEditFormToUpdateIn } from '../helpers/adMappers'

export const updateAd = async (id: number, form: AdEditFormState) => {
  const payload = mapAdEditFormToUpdateIn(form)
  const { data } = await api.put(`/items/${id}`, payload)
  return data
}

