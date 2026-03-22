import { api } from "./axios"
import type { Ad } from "../types"

type GetAdsParams = {
  limit?: number
  skip?: number
}

export const getAds = async ({ limit, skip }: GetAdsParams = {}): Promise<{ items: Ad[]; total: number }> => {

  const params: any = {}
  if (limit !== undefined) params.limit = limit
  if (skip !== undefined) params.skip = skip

  const { data } = await api.get("/items", { params })
  return data
}