import React from 'react'
import { useNavigate, useParams} from 'react-router-dom'
import { getAdById } from '../../api/getAds'
import type { AdDetails } from '../../types'
import { formatDateTime, formatPrice, parseDateValue } from '../../helpers/adFormatters'
import AdViewHeader from './components/AdViewHeader'
import ImageGallery from './components/ImageGallery'
import NeedsRevisionAlert from './components/NeedsRevisionAlert'
import FeaturesList from './components/FeaturesList'

export default function AdView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const requestIdRef = React.useRef(0)
  const [ad, setAd] = React.useState<AdDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const parsedId = Number(id)
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setError('Некорректный идентификатор объявления')
      setIsLoading(false)
      return
    }

    const fetchAd = async () => {
      const requestId = ++requestIdRef.current
      setIsLoading(true)
      setError(null)

      try {
        const details = await getAdById(parsedId)
        if (requestId !== requestIdRef.current) return
        setAd(details)
      } catch {
        if (requestId !== requestIdRef.current) return
        setError('Ошибка загрузки объявления')
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    fetchAd()
  }, [id])

  const createdAtDate = parseDateValue(ad?.createdAt ?? '')
  const updatedAtDate = parseDateValue(ad?.updatedAt ?? '')
  const isEdited =
    Boolean(createdAtDate && updatedAtDate) &&
    updatedAtDate!.getTime() > createdAtDate!.getTime()

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>
  if (!ad) return <p>Объявление не найдено</p>

  return (
    <>
      <AdViewHeader
        title={ad.title}
        price={formatPrice(ad.price)}
        createdAtLabel={formatDateTime(ad.createdAt)}
        updatedAtLabel={isEdited ? formatDateTime(ad.updatedAt) : undefined}
        onBack={() => navigate('/ads')}
        onEdit={() => navigate(`/ads/${id}/edit`)}
      />

      <hr />

      <main className="ad-view-main">
        <section className="ad-view-top-grid">
          <ImageGallery title={ad.title} imageUrls={ad.imageUrls} category={ad.category} />
          <div className="ad-view-side-panel">
            {ad.needsRevision && <NeedsRevisionAlert missingFields={ad.missingFields} />}
            <FeaturesList category={ad.category} params={ad.params} />
          </div>
        </section>

        <div className="ad-view-description-block">
          <h3>Описание</h3>
          <p>{ad.description || 'Отсутствует'}</p>
        </div>
      </main>
    </>
  )
}