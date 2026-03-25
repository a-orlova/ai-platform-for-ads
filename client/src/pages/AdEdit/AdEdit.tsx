import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAdById } from '../../api/getAds'
import { updateAd } from '../../api/updateAd'
import { getInitialAdEditFormState, mapAdDetailsToEditForm } from '../../helpers/adMappers'
import { requiredFieldMessage } from '../../helpers/adEditMessages'
import { canSaveAdEdit, isPriceFilled, isTypeFilled } from '../../helpers/adEditValidation'
import type { AdEditFormState, Category } from '../../types'
import AdEditParamsFields from './components/AdEditParamsFields'
import AiQuestionBtn from './components/AiQuestionBtn.tsx'
import { generateOllama } from '../../api/ollamaClient'
import PageLoading from '../../components/PageLoading'
import { buildImproveDescriptionPrompt, buildMarketPricePrompt } from '../../helpers/aiPrompts'
import AiTooltip, { type AiTooltipVariant } from './components/AiTooltip'
import { extractOllamaTextResponse } from '../../helpers/ollamaResponse'
import { parsePositiveInt } from '../../helpers/parsePositiveInt'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

const DESCRIPTION_LIMIT = 1000
const AD_EDIT_DRAFT_PREFIX = 'ad-edit-draft'

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
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [toast, setToast] = React.useState<{
    open: boolean
    severity: 'success' | 'error'
    message: string
  }>({ open: false, severity: 'success', message: '' })
  const toastRedirectTimerRef = React.useRef<number | null>(null)
  const redirectOverlayTimerRef = React.useRef<number | null>(null)
  const [isRedirecting, setIsRedirecting] = React.useState(false)
  const [isDarkTheme, setIsDarkTheme] = React.useState(false)
  const [touched, setTouched] = React.useState<TouchedFields>({
    title: false,
    price: false,
    type: false,
  })

  const [priceAiTooltip, setPriceAiTooltip] = React.useState<{
    isOpen: boolean
    variant: AiTooltipVariant
    text: string
  }>({ isOpen: false, variant: 'normal', text: '' })

  const [descriptionAiTooltip, setDescriptionAiTooltip] = React.useState<{
    isOpen: boolean
    variant: AiTooltipVariant
    text: string
  }>({ isOpen: false, variant: 'normal', text: '' })

  const showTitleError = touched.title && !form.title.trim()
  const showPriceError = touched.price && !isPriceFilled(form.price)
  const showTypeError =
    touched.type && !isTypeFilled(form.category, form) && (form.category === 'electronics' || form.category === 'real_estate')

  const saveEnabled = canSaveAdEdit(form)
  const adId = React.useMemo(() => {
    return parsePositiveInt(id)
  }, [id])
  const draftKey = adId ? `${AD_EDIT_DRAFT_PREFIX}:${adId}` : null

  React.useEffect(() => {
    return () => {
      if (toastRedirectTimerRef.current) window.clearTimeout(toastRedirectTimerRef.current)
      if (redirectOverlayTimerRef.current) window.clearTimeout(redirectOverlayTimerRef.current)
    }
  }, [])

  React.useEffect(() => {
    setIsDarkTheme(document.documentElement.getAttribute('data-theme') === 'dark')
  }, [])

  const titleClass =
    showTitleError ? 'ad-edit-control ad-edit-control--error' : 'ad-edit-control ad-edit-control--filled'
  const priceClass =
    showPriceError ? 'ad-edit-control ad-edit-control--error' : 'ad-edit-control ad-edit-control--filled'
  const descriptionClass =
    form.description.trim() === ''
      ? 'ad-edit-control ad-edit-control--optional-empty'
      : 'ad-edit-control ad-edit-control--filled'

  React.useEffect(() => {
    if (!adId) {
      setError('Некорректный идентификатор объявления')
      setIsLoading(false)
      return
    }

    const loadAd = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const ad = await getAdById(adId)
        const baseForm = mapAdDetailsToEditForm(ad)
        const rawDraft = localStorage.getItem(draftKey ?? '')

        if (rawDraft) {
          try {
            const parsed = JSON.parse(rawDraft) as AdEditFormState
            setForm(parsed)
          } catch {
            setForm(baseForm)
          }
        } else {
          setForm(baseForm)
        }
      } catch {
        setError('Ошибка загрузки объявления')
      } finally {
        setIsLoading(false)
      }
    }

    loadAd()
  }, [adId, draftKey])

  React.useEffect(() => {
    if (!draftKey) return
    if (isLoading || error) return
    localStorage.setItem(draftKey, JSON.stringify(form))
  }, [draftKey, form, isLoading, error])

  const handleCancelAndGoBack = () => {
    if (draftKey) localStorage.removeItem(draftKey)
    if (adId) navigate(`/ads/${adId}`)
    else navigate('/ads')
  }

  const handleSave = async () => {
    if (!adId) return
    if (!saveEnabled) return
    if (toastRedirectTimerRef.current) {
      window.clearTimeout(toastRedirectTimerRef.current)
      toastRedirectTimerRef.current = null
    }
    if (redirectOverlayTimerRef.current) {
      window.clearTimeout(redirectOverlayTimerRef.current)
      redirectOverlayTimerRef.current = null
    }
    setIsRedirecting(false)
    setIsSaving(true)
    setError(null)
    try {
      await updateAd(adId, form)
      if (draftKey) localStorage.removeItem(draftKey)
      setToast({ open: true, severity: 'success', message: 'Изменения сохранены' })
      redirectOverlayTimerRef.current = window.setTimeout(() => setIsRedirecting(true), 1700)
      toastRedirectTimerRef.current = window.setTimeout(() => navigate(`/ads/${adId}`), 2000)
    } catch {
      setIsRedirecting(false)
      setToast({
        open: true,
        severity: 'error',
        message: 'Ошибка сохранения',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading)
    return <PageLoading />
  if (error) return <p>{error}</p>

  return (
    <main className="ad-edit-page">
      <Snackbar
        open={toast.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{
            alignItems: 'center',
            color: 'inherit',
            border: '1px solid transparent',
            ...(toast.severity === 'success'
              ? {
                  backgroundColor: isDarkTheme ? '#9EDC76' : '#B7EB8F',
                  borderColor: isDarkTheme ? '#9EDC76' : '#B7EB8F',
                  '& .MuiAlert-icon': { color: isDarkTheme ? '#389E0D' : '#52C41A' },
                }
              : {
                  backgroundColor: isDarkTheme ? '#FBE0DE' : '#FFF1F0',
                  borderColor: isDarkTheme ? '#FFB8B0' : '#FFCCC7',
                  '& .MuiAlert-icon': { color: isDarkTheme ? '#D9363E' : '#FF4D4F' },
                }),
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {isRedirecting ? (
        <div className="page-transition-overlay">
          <h1>Загружаем страницу....</h1>
        </div>
      ) : null}

      <div className="ad-edit-title-row">
        <button
          className="ad-view-back-btn"
          onClick={handleCancelAndGoBack}
          aria-label="Назад к объявлению"
        >
          <ArrowBackIcon />
        </button>
        <h1 className="ad-edit-title">Редактирование объявления</h1>
      </div>

      <form
        className="ad-edit-form"
        onSubmit={(e) => {
          e.preventDefault()
          void handleSave()
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
            <div className="ai-tooltip-anchor">
              <AiQuestionBtn
                mode="price"
                onClick={async () => {
                  const prompt = buildMarketPricePrompt(form)

                  try {
                    const result = await generateOllama({ prompt, model: 'llama3' })

                    const responseText = extractOllamaTextResponse(result)

                    setPriceAiTooltip({ isOpen: true, variant: 'normal', text: responseText })
                  } catch (e) {
                    const message = e instanceof Error ? e.message : String(e)
                    setPriceAiTooltip({ isOpen: true, variant: 'error', text: message })
                  }
                }}
              />

              {priceAiTooltip.isOpen ? (
                <AiTooltip
                  variant={priceAiTooltip.variant}
                  text={priceAiTooltip.text}
                  onClose={() => setPriceAiTooltip((prev) => ({ ...prev, isOpen: false }))}
                  showAttachButton={false}
                />
              ) : null}
            </div>
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
            <div className="ai-tooltip-anchor">
              <AiQuestionBtn
                mode="description"
                descriptionValue={form.description}
                onClick={async () => {
                  const prompt = buildImproveDescriptionPrompt(form)

                  try {
                    const result = await generateOllama({ prompt, model: 'llama3' })

                    const responseText = extractOllamaTextResponse(result)

                    setDescriptionAiTooltip({ isOpen: true, variant: 'normal', text: responseText })
                  } catch (e) {
                    const message = e instanceof Error ? e.message : String(e)
                    setDescriptionAiTooltip({ isOpen: true, variant: 'error', text: message })
                  }
                }}
              />

              {descriptionAiTooltip.isOpen ? (
                <AiTooltip
                  variant={descriptionAiTooltip.variant}
                  text={descriptionAiTooltip.text}
                  onClose={() => setDescriptionAiTooltip((prev) => ({ ...prev, isOpen: false }))}
                  onAttach={() => {
                    if (descriptionAiTooltip.variant === 'normal') {
                      setForm((prev) => ({
                        ...prev,
                        description: descriptionAiTooltip.text.slice(0, DESCRIPTION_LIMIT),
                      }))
                    }
                    setDescriptionAiTooltip((prev) => ({ ...prev, isOpen: false }))
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="ad-edit-actions">
          <button type="submit" className="ad-edit-save" disabled={!saveEnabled || isSaving}>
            Сохранить
          </button>
          <button
            type="button"
            className="ad-edit-cancel"
            onClick={handleCancelAndGoBack}
          >
            Отменить
          </button>
        </div>
      </form>
    </main>
  )
}
