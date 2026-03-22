import Header from './Header'
import Filters from './Filters'
import Item from './Item'
import { getAds } from '../../api/getAds'
import type { Ad } from '../../types'
import React from 'react'

export default function AdsList() {

  const [ads, setAds] = React.useState<Ad[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAds()
        setAds(data)
      } catch (e) {
        setError("Ошибка загрузки")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  if (loading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return(
    <>
      <Header />
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
    </>
  )
}