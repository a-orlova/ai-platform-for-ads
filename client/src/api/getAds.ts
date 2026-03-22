import { api } from "./axios"
import type { Ad } from "../types"

export const getAds = async (): Promise<Ad[]> => {
  const { data } = await api.get("/items")

  return data.items
}