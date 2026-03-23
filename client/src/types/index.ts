export type Category = 'auto' | 'electronics' | 'real_estate'
export type SortColumn = 'title' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export type Ad = {
  id: number
  title: string
  price: number
  category: Category
  needsRevision: boolean
  missingFields: string[]
  imageUrl?: string
}

export type GetAdsParams = {
  q?: string
  limit?: number
  skip?: number
  categories?: Category[]
  needsRevision?: boolean
  sortColumn?: SortColumn
  sortDirection?: SortDirection
}

export type ApiListItem = {
  title: string
  price: number
  category: Category
  needsRevision: boolean
  imageUrl?: string
  image?: string
  photoUrl?: string
  photo?: string
}

export type ApiItemDetails = {
  category: Category
  description?: string
  params?: Record<string, unknown>
}

export type AdsListStoredState = {
  searchQuery: string
  currentPage: number
  viewMode: 'grid' | 'list'
  selectedCategories: Category[]
  onlyNeedsRevision: boolean
  sortColumn: SortColumn
  sortDirection: SortDirection
}