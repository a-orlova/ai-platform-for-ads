export type Category = 'auto' | 'electronics' | 'real_estate'
export type SortColumn = 'title' | 'createdAt'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list'

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
  id: number
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
  id?: number
  title?: string
  price?: number | null
  createdAt?: string
  updatedAt?: string
  category: Category
  description?: string
  params?: Record<string, unknown>
  imageUrl?: string
  image?: string
  photoUrl?: string
  photo?: string
  images?: string[]
  photos?: string[]
  imageUrls?: string[]
  photoUrls?: string[]
}

export type AdDetails = {
  id: number
  title: string
  description: string
  price: number | null
  createdAt: string
  updatedAt: string
  category: Category
  params: Record<string, unknown>
  needsRevision: boolean
  missingFields: string[]
  imageUrl?: string
  imageUrls: string[]
}

export type AdsListStoredState = {
  searchQuery: string
  currentPage: number
  viewMode: ViewMode
  selectedCategories: Category[]
  onlyNeedsRevision: boolean
  sortColumn: SortColumn
  sortDirection: SortDirection
}

export type AutoParamsForm = {
  brand: string
  model: string
  yearOfManufacture: string
  transmission: '' | 'automatic' | 'manual'
  mileage: string
  enginePower: string
}

export type RealEstateParamsForm = {
  type: '' | 'flat' | 'house' | 'room'
  address: string
  area: string
  floor: string
}

export type ElectronicsParamsForm = {
  type: '' | 'phone' | 'laptop' | 'misc'
  brand: string
  model: string
  condition: '' | 'new' | 'used'
  color: string
}

export type AdEditFormState = {
  category: Category
  title: string
  price: string
  description: string
  autoParams: AutoParamsForm
  realEstateParams: RealEstateParamsForm
  electronicsParams: ElectronicsParamsForm
}