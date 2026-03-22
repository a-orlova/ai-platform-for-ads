import Header from './Header'
import Filters from './Filters'
import Item from './Item'
import Pagination from './Pagination'
import { getAds } from '../../api/getAds'
import type { Ad } from '../../types'
import React from 'react'

export default function AdsList() {

  const [ads, setAds] = React.useState<Ad[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10
  const [totalItems, setTotalItems] = React.useState(0)

  React.useEffect(() => {
    const fetchAds = async () => {
      setLoading(true)
      setError(null)

      try {
        const skip = (currentPage - 1) * itemsPerPage
        const data = await getAds({ limit: itemsPerPage, skip })
        setAds(data.items)
        setTotalItems(data.total)
      } catch (e) {
        setError("Ошибка загрузки")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [currentPage])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return(
    <>
      <Header />
      <div className="ads-page">
        <Filters />
        <div className="ads-list">
          {ads.map((ad) => (
            <Item
              key={ad.id}
              title={ad.title}
              price={ad.price}
              category={ad.category}
              needsRevision={ad.needsRevision}
            />
          ))}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )
}