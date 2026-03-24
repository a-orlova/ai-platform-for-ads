import type { AdsListStoredState, Category } from '../types'

export const ADS_LIST_STATE_STORAGE_KEY = 'ads-list-state'

export const defaultAdsListStoredState: AdsListStoredState = {
  searchQuery: '',
  currentPage: 1,
  viewMode: 'grid',
  selectedCategories: [],
  onlyNeedsRevision: false,
  sortColumn: 'createdAt',
  sortDirection: 'desc',
}

const isCategory = (value: unknown): value is Category =>
  value === 'auto' || value === 'electronics' || value === 'real_estate'

export const readAdsListStoredState = (): AdsListStoredState => {
  try {
    const rawState = localStorage.getItem(ADS_LIST_STATE_STORAGE_KEY)
    if (!rawState) return defaultAdsListStoredState

    const parsed = JSON.parse(rawState) as Partial<AdsListStoredState>

    return {
      searchQuery: typeof parsed.searchQuery === 'string' ? parsed.searchQuery : '',
      currentPage: typeof parsed.currentPage === 'number' && parsed.currentPage > 0 ? parsed.currentPage : 1,
      viewMode: parsed.viewMode === 'list' ? 'list' : 'grid',
      selectedCategories: Array.isArray(parsed.selectedCategories) ? parsed.selectedCategories.filter(isCategory) : [],
      onlyNeedsRevision: Boolean(parsed.onlyNeedsRevision),
      sortColumn: parsed.sortColumn === 'title' ? 'title' : 'createdAt',
      sortDirection: parsed.sortDirection === 'asc' ? 'asc' : 'desc',
    }
  } catch {
    return defaultAdsListStoredState
  }
}
