import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdById } from '../../api/getAds'
import { getInitialAdEditFormState, mapAdDetailsToEditForm } from '../../helpers/adMappers'
import type { AdEditFormState, Category } from '../../types'
import AdEditParamsFields from './components/AdEditParamsFields'

const DESCRIPTION_LIMIT = 1000

const categoryLabels: Record<Category, string> = {
  auto: 'Транспорт',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

export default function AdEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = React.useState<AdEditFormState>(getInitialAdEditFormState)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const adId = Number(id)
    if (!Number.isInteger(adId) || adId <= 0) {
      setError('Некорректный идентификатор объявления')
      setIsLoading(false)
      return
    }

    const loadAd = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const ad = await getAdById(adId)
        setForm(mapAdDetailsToEditForm(ad))
      } catch {
        setError('Ошибка загрузки объявления')
      } finally {
        setIsLoading(false)
      }
    }

    loadAd()
  }, [id])

  if (isLoading) return <p>Загрузка...</p>
  if (error) return <p>{error}</p>

  return (
    <main>
      <h1>Редактирование объявления</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div>
          <label htmlFor="category">Категория *</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}
            required
          >
            <option value="electronics">{categoryLabels.electronics}</option>
            <option value="auto">{categoryLabels.auto}</option>
            <option value="real_estate">{categoryLabels.real_estate}</option>
          </select>
        </div>

        <div>
          <label htmlFor="title">Название *</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Цена *</label>
          <div>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1}
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
            <button type="button">Узнать рыночную цену</button>
          </div>
        </div>

        <h3>Характеристики</h3>
        <AdEditParamsFields form={form} setForm={setForm} />

        <div>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            maxLength={DESCRIPTION_LIMIT}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <p>
            Символы: {form.description.length} / {DESCRIPTION_LIMIT}
          </p>
          <button type="button">Придумать описание</button>
        </div>

        <div>
          <button type="submit">Сохранить</button>
          <button
            type="button"
            onClick={() => {
              if (id) navigate(`/ads/${id}`)
              else navigate('/ads')
            }}
          >
            Отменить
          </button>
        </div>
      </form>
    </main>
  )
}