import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdById } from '../../api/getAds'
import { getInitialAdEditFormState, mapAdDetailsToEditForm } from '../../helpers/adMappers'
import { requiredFieldMessage } from '../../helpers/adEditMessages'
import { canSaveAdEdit, isPriceFilled, isTypeFilled } from '../../helpers/adEditValidation'
import type { AdEditFormState, Category } from '../../types'
import AdEditParamsFields from './components/AdEditParamsFields'
import AiQuestionBtn from './components/AiQuestionBtn'

const DESCRIPTION_LIMIT = 1000

const categoryLabels: Record<Category, string> = {
  auto: 'Транспорт',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

type TouchedFields = {
  title: boolean
  price: boolean
  type: boolean
}

export default function AdEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = React.useState<AdEditFormState>(getInitialAdEditFormState)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [touched, setTouched] = React.useState<TouchedFields>({
    title: false,
    price: false,
    type: false,
  })

  const showTitleError = touched.title && !form.title.trim()
  const showPriceError = touched.price && !isPriceFilled(form.price)
  const showTypeError =
    touched.type && !isTypeFilled(form.category, form) && (form.category === 'electronics' || form.category === 'real_estate')

  const saveEnabled = canSaveAdEdit(form)

  const titleClass =
    showTitleError ? 'ad-edit-control ad-edit-control--error' : 'ad-edit-control ad-edit-control--filled'
  const priceClass =
    showPriceError ? 'ad-edit-control ad-edit-control--error' : 'ad-edit-control ad-edit-control--filled'
  const descriptionClass =
    form.description.trim() === ''
      ? 'ad-edit-control ad-edit-control--optional-empty'
      : 'ad-edit-control ad-edit-control--filled'

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
    <main className="ad-edit-page">
      <h1 className="ad-edit-title">Редактирование объявления</h1>

      <form
        className="ad-edit-form"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <div className="ad-edit-field">
          <label className="ad-edit-label" htmlFor="category">
            Категория
          </label>
          <select
            id="category"
            name="category"
            className="ad-edit-control ad-edit-control--filled"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Category }))}
          >
            <option value="electronics">{categoryLabels.electronics}</option>
            <option value="auto">{categoryLabels.auto}</option>
            <option value="real_estate">{categoryLabels.real_estate}</option>
          </select>
        </div>

        <div className="ad-edit-field">
          <label className="ad-edit-label" htmlFor="title">
            Название <span className="ad-edit-required">*</span>
          </label>
          <div className="ad-edit-input-row">
            <input
              id="title"
              name="title"
              type="text"
              className={titleClass}
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            />
            {form.title ? (
              <button
                type="button"
                className="ad-edit-clear"
                aria-label="Очистить название"
                onClick={() => setForm((prev) => ({ ...prev, title: '' }))}
              >
                ×
              </button>
            ) : null}
          </div>
          {showTitleError ? (
            <p className="ad-edit-field-error">{requiredFieldMessage('Название')}</p>
          ) : null}
        </div>

        <div className="ad-edit-field">
          <label className="ad-edit-label" htmlFor="price">
            Цена <span className="ad-edit-required">*</span>
          </label>
          <div className="ad-edit-price-row">
            <div className="ad-edit-input-row ad-edit-input-row--grow">
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                className={priceClass}
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                onBlur={() => setTouched((prev) => ({ ...prev, price: true }))}
              />
              {form.price ? (
                <button
                  type="button"
                  className="ad-edit-clear"
                  aria-label="Очистить цену"
                  onClick={() => setForm((prev) => ({ ...prev, price: '' }))}
                >
                  ×
                </button>
              ) : null}
            </div>
            <AiQuestionBtn mode="price" />
          </div>
          {showPriceError ? (
            <p className="ad-edit-field-error">{requiredFieldMessage('Цена')}</p>
          ) : null}
        </div>

        <h3 className="ad-edit-section-title">Характеристики</h3>
        <AdEditParamsFields
          form={form}
          setForm={setForm}
          showTypeError={showTypeError}
          onTypeBlur={() => setTouched((prev) => ({ ...prev, type: true }))}
        />

        <div className="ad-edit-field">
          <label className="ad-edit-label" htmlFor="description">
            Описание
          </label>
          <div className="ad-edit-textarea-wrap">
            <textarea
              id="description"
              name="description"
              className={descriptionClass}
              rows={6}
              maxLength={DESCRIPTION_LIMIT}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
            {form.description ? (
              <button
                type="button"
                className="ad-edit-clear ad-edit-clear--textarea"
                aria-label="Очистить описание"
                onClick={() => setForm((prev) => ({ ...prev, description: '' }))}
              >
                ×
              </button>
            ) : null}
          </div>
          <p className="ad-edit-counter">
            Символы: {form.description.length} / {DESCRIPTION_LIMIT}
          </p>
          <div className="ad-edit-description-ai-row">
            <AiQuestionBtn mode="description" descriptionValue={form.description} />
          </div>
        </div>

        <div className="ad-edit-actions">
          <button type="submit" className="ad-edit-save" disabled={!saveEnabled}>
            Сохранить
          </button>
          <button
            type="button"
            className="ad-edit-cancel"
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
