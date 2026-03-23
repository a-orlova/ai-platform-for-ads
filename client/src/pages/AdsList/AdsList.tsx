import Header from './Header'
import Filters from './Filters'
import Item from './Item'
import Pagination from './Pagination'
import { getAds } from '../../api/getAds'
import type { Ad } from '../../types'
import React from 'react'

export default function AdsList() {

  const [ads, setAds] = React.useState<Ad[]>([])
  const [isInitialLoading, setIsInitialLoading] = React.useState(true)
  const [isFetching, setIsFetching] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('')

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const [totalItems, setTotalItems] = React.useState(0)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [selectedCategories, setSelectedCategories] = React.useState<Array<'auto' | 'electronics' | 'real_estate'>>([])
  const [onlyNeedsRevision, setOnlyNeedsRevision] = React.useState(false)
  const [sortColumn, setSortColumn] = React.useState<'title' | 'createdAt'>('createdAt')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc')
  const requestIdRef = React.useRef(0)

  const sortValue = `${sortColumn}_${sortDirection}`

  React.useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 150)

    return () => window.clearTimeout(timerId)
  }, [searchQuery])

  React.useEffect(() => {
    const fetchAds = async () => {
      const requestId = ++requestIdRef.current
      setIsFetching(true)
      setError(null)

      try {
        const skip = (currentPage - 1) * itemsPerPage
        const data = await getAds({
          limit: itemsPerPage,
          skip,
          q: debouncedSearchQuery,
          categories: selectedCategories,
          needsRevision: onlyNeedsRevision,
          sortColumn,
          sortDirection,
        })

        if (requestId !== requestIdRef.current) return

        setAds(data.items)
        setTotalItems(data.total)
      } catch (e) {
        if (requestId !== requestIdRef.current) return
        setError("Ошибка загрузки")
      } finally {
        if (requestId === requestIdRef.current) {
          setIsInitialLoading(false)
          setIsFetching(false)
        }
      }
    }

    fetchAds()
  }, [
    currentPage,
    debouncedSearchQuery,
    selectedCategories,
    onlyNeedsRevision,
    sortColumn,
    sortDirection,
  ])

  function handleSortChange(value: string) {
    const [nextSortColumn, nextSortDirection] = value.split('_') as [
      'title' | 'createdAt',
      'asc' | 'desc'
    ]

    setSortColumn(nextSortColumn)
    setSortDirection(nextSortDirection)
    setCurrentPage(1)
  }

  function handleResetFilters() {
    setSelectedCategories([])
    setOnlyNeedsRevision(false)
    setSearchQuery('')
    setSortColumn('createdAt')
    setSortDirection('desc')
    setCurrentPage(1)
  }

  if (isInitialLoading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return(
    <>
      <Header viewMode={viewMode} 
              onViewModeChange={setViewMode} 
              searchQuery={searchQuery}
              onSearchQueryChange={(value) => {
                setSearchQuery(value)
                setCurrentPage(1)
              }}
              sortValue={sortValue}
              onSortChange={handleSortChange}
              totalItems={totalItems} />
      <div className="ads-page-wrapper">
        <div className="ads-page">
          <Filters
            selectedCategories={selectedCategories}
            onCategoriesChange={(categories) => {
              setSelectedCategories(categories)
              setCurrentPage(1)
            }}
            onlyNeedsRevision={onlyNeedsRevision}
            onOnlyNeedsRevisionChange={(value) => {
              setOnlyNeedsRevision(value)
              setCurrentPage(1)
            }}
            onResetFilters={handleResetFilters}
          />
          <div className="ads-content">
            {isFetching && <p className="inline-loading">Загружаем объявления...</p>}
            {ads.length === 0 ? (
              <div className="empty-search-result">
                По запросу «{debouncedSearchQuery || searchQuery}» ничего не найдено
              </div>
            ) : (
              <div className={`ads-grid ${viewMode === 'list' ? 'ads-list-view' : ''}`}>
                {ads.map((ad) => (
                  <Item
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    price={ad.price}
                    category={ad.category}
                    needsRevision={ad.needsRevision}
                    imageUrl={ad.imageUrl}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
      
    </>
  )
}