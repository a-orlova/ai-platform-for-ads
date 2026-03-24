import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import ErrorIcon from '@mui/icons-material/Error'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getAdById } from '../../api/getAds'
import type { AdDetails, Category } from '../../types'
import BuildingPlaceholder from '../../assets/images/building.svg'
import AutoPlaceholder from '../../assets/images/shape.svg'
import ElectronicsPlaceholder from '../../assets/images/product.svg'

const categoryLabels: Record<Category, string> = {
  auto: 'Транспорт',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

const paramLabels: Record<string, string> = {
  type: 'Тип',
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
  condition: 'Состояние',
  color: 'Цвет',
}

const paramValueLabels: Record<string, string> = {
  automatic: 'Автомат',
  manual: 'Механика',
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
  new: 'Новый',
  used: 'Б/у',
}

const formatPrice = (price: number | null) =>
  price === null ? 'Цена не указана' : `${new Intl.NumberFormat('ru-RU').format(price)} ₽`

const formatDateTime = (value: string) => {
  if (!value) return 'Не указано'

  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return 'Не указано'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsedDate)
}

const parseDateValue = (value: string) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatParamValue = (value: unknown) => {
  if (typeof value === 'string') {
    return paramValueLabels[value] ?? value
  }
  if (typeof value === 'number') {
    return new Intl.NumberFormat('ru-RU').format(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'Да' : 'Нет'
  }
  return ''
}

const getCategoryPlaceholder = (category: Category) => {
  if (category === 'real_estate') return BuildingPlaceholder
  if (category === 'auto') return AutoPlaceholder
  return ElectronicsPlaceholder
}

export default function AdView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const requestIdRef = React.useRef(0)
  const [ad, setAd] = React.useState<AdDetails | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [brokenImageUrls, setBrokenImageUrls] = React.useState<Set<string>>(new Set())

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
        setSelectedImageIndex(0)
        setBrokenImageUrls(new Set())
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

  const features = React.useMemo(() => {
    if (!ad) return []

    return Object.entries(ad.params)
      .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== '')
      .map(([key, value]) => ({
        label: paramLabels[key] ?? key,
        value: formatParamValue(value),
      }))
      .filter((item) => item.value.length > 0)
  }, [ad])

  const categoryPlaceholder = ad ? getCategoryPlaceholder(ad.category) : ElectronicsPlaceholder

  const visibleImageUrls = React.useMemo(() => {
    if (!ad) return []
    return ad.imageUrls.filter((url) => !brokenImageUrls.has(url))
  }, [ad, brokenImageUrls])

  React.useEffect(() => {
    if (!visibleImageUrls.length) {
      setSelectedImageIndex(0)
      return
    }

    if (selectedImageIndex >= visibleImageUrls.length) {
      setSelectedImageIndex(0)
    }
  }, [visibleImageUrls, selectedImageIndex])

  const mainImageSrc = visibleImageUrls[selectedImageIndex] ?? categoryPlaceholder
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
      <header>
        <div className="title-block">
          <Link to="/ads">
            <ArrowBackIcon />
          </Link>
          <h1>{ad.title}</h1>
            <button onClick={() => navigate(`/ads/${id}/edit`)}>
              Редактировать
              <BorderColorIcon />
            </button>
        </div>
        <div className="price-block">
          <h2>{formatPrice(ad.price)}</h2>
          <p>Опубликовано {formatDateTime(ad.createdAt)}</p>
          {isEdited && <p>Отредактировано {formatDateTime(ad.updatedAt)}</p>}
        </div>
      </header>

      <hr />

      <main>
        <div className="description-block">
          <div className="ad-view-gallery">
            <div className="ad-view-main-image">
              <img
                src={mainImageSrc}
                alt={ad.title}
                onError={() => {
                  if (!visibleImageUrls[selectedImageIndex]) return
                  setBrokenImageUrls((prev) => {
                    const next = new Set(prev)
                    next.add(visibleImageUrls[selectedImageIndex])
                    return next
                  })
                }}
              />
            </div>
            {visibleImageUrls.length > 1 && (
              <div className="ad-view-thumbnails" role="list">
                {visibleImageUrls.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    className={`ad-view-thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${ad.title} ${index + 1}`}
                      onError={() => {
                        setBrokenImageUrls((prev) => {
                          const next = new Set(prev)
                          next.add(imageUrl)
                          return next
                        })
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
            <h3>Описание</h3>
            <p>{ad.description || 'Отсутствует'}</p>
        </div>

        {ad.needsRevision && (
          <div className="alert-block">
            <ErrorIcon />
            <h4>Требуются доработки</h4>
            <p>У объявления не заполнены поля:</p>
            <ul>
              {ad.missingFields.map((field) => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="features-block">
          <h3>Характеристики</h3>
          <p>Категория: {categoryLabels[ad.category]}</p>
          {features.length > 0 ? (
            <ul>
              {features.map((feature) => (
                <li key={feature.label}>{feature.label}: {feature.value}</li>
              ))}
            </ul>
          ) : (
            <p>Характеристики не заполнены</p>
          )}
        </div>
      </main>
    </>
  )
}