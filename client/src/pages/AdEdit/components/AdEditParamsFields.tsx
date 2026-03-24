import React from 'react'
import { requiredFieldMessage } from '../../../helpers/adEditMessages'
import type { AdEditFormState } from '../../../types'

type AdEditParamsFieldsProps = {
  form: AdEditFormState
  setForm: React.Dispatch<React.SetStateAction<AdEditFormState>>
  showTypeError: boolean
  onTypeBlur: () => void
}

const optionalControlClass = (isEmpty: boolean) =>
  isEmpty ? 'ad-edit-control ad-edit-control--optional-empty' : 'ad-edit-control ad-edit-control--filled'

const typeControlClass = (isEmpty: boolean, showError: boolean) => {
  if (showError && isEmpty) return 'ad-edit-control ad-edit-control--error'
  if (isEmpty) return 'ad-edit-control ad-edit-control--optional-empty'
  return 'ad-edit-control ad-edit-control--filled'
}

export default function AdEditParamsFields({
  form,
  setForm,
  showTypeError,
  onTypeBlur,
}: AdEditParamsFieldsProps) {
  if (form.category === 'auto') {
    return (
      <>
        <label className="ad-edit-label" htmlFor="auto-brand">
          Марка
        </label>
        <input
          id="auto-brand"
          type="text"
          className={optionalControlClass(!form.autoParams.brand.trim())}
          value={form.autoParams.brand}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, brand: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="auto-model">
          Модель
        </label>
        <input
          id="auto-model"
          type="text"
          className={optionalControlClass(!form.autoParams.model.trim())}
          value={form.autoParams.model}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, model: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="auto-year">
          Год выпуска
        </label>
        <input
          id="auto-year"
          type="number"
          min={1900}
          className={optionalControlClass(!form.autoParams.yearOfManufacture.trim())}
          value={form.autoParams.yearOfManufacture}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, yearOfManufacture: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="auto-transmission">
          Коробка передач
        </label>
        <select
          id="auto-transmission"
          className={optionalControlClass(form.autoParams.transmission === '')}
          value={form.autoParams.transmission}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: {
                ...prev.autoParams,
                transmission: e.target.value as '' | 'automatic' | 'manual',
              },
            }))
          }
        >
          <option value="">Не указано</option>
          <option value="automatic">Автомат</option>
          <option value="manual">Механика</option>
        </select>

        <label className="ad-edit-label" htmlFor="auto-mileage">
          Пробег
        </label>
        <input
          id="auto-mileage"
          type="number"
          min={0}
          className={optionalControlClass(!form.autoParams.mileage.trim())}
          value={form.autoParams.mileage}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, mileage: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="auto-engine-power">
          Мощность двигателя
        </label>
        <input
          id="auto-engine-power"
          type="number"
          min={0}
          className={optionalControlClass(!form.autoParams.enginePower.trim())}
          value={form.autoParams.enginePower}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, enginePower: e.target.value },
            }))
          }
        />
      </>
    )
  }

  if (form.category === 'real_estate') {
    const typeEmpty = form.realEstateParams.type === ''
    return (
      <>
        <div className="ad-edit-field">
          <label className="ad-edit-label" htmlFor="real-estate-type">
            Тип недвижимости <span className="ad-edit-required">*</span>
          </label>
          <select
            id="real-estate-type"
            className={typeControlClass(typeEmpty, showTypeError)}
            value={form.realEstateParams.type}
            onBlur={onTypeBlur}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                realEstateParams: {
                  ...prev.realEstateParams,
                  type: e.target.value as '' | 'flat' | 'house' | 'room',
                },
              }))
            }
          >
            <option value="">Не указано</option>
            <option value="flat">Квартира</option>
            <option value="house">Дом</option>
            <option value="room">Комната</option>
          </select>
          {showTypeError && typeEmpty && (
            <p className="ad-edit-field-error">{requiredFieldMessage('Тип недвижимости')}</p>
          )}
        </div>

        <label className="ad-edit-label" htmlFor="real-estate-address">
          Адрес
        </label>
        <input
          id="real-estate-address"
          type="text"
          className={optionalControlClass(!form.realEstateParams.address.trim())}
          value={form.realEstateParams.address}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              realEstateParams: { ...prev.realEstateParams, address: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="real-estate-area">
          Площадь
        </label>
        <input
          id="real-estate-area"
          type="number"
          min={0}
          className={optionalControlClass(!form.realEstateParams.area.trim())}
          value={form.realEstateParams.area}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              realEstateParams: { ...prev.realEstateParams, area: e.target.value },
            }))
          }
        />

        <label className="ad-edit-label" htmlFor="real-estate-floor">
          Этаж
        </label>
        <input
          id="real-estate-floor"
          type="number"
          min={0}
          className={optionalControlClass(!form.realEstateParams.floor.trim())}
          value={form.realEstateParams.floor}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              realEstateParams: { ...prev.realEstateParams, floor: e.target.value },
            }))
          }
        />
      </>
    )
  }

  const typeEmpty = form.electronicsParams.type === ''
  return (
    <>
      <div className="ad-edit-field">
        <label className="ad-edit-label" htmlFor="electronics-type">
          Тип устройства <span className="ad-edit-required">*</span>
        </label>
        <select
          id="electronics-type"
          className={typeControlClass(typeEmpty, showTypeError)}
          value={form.electronicsParams.type}
          onBlur={onTypeBlur}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              electronicsParams: {
                ...prev.electronicsParams,
                type: e.target.value as '' | 'phone' | 'laptop' | 'misc',
              },
            }))
          }
        >
          <option value="">Не указано</option>
          <option value="phone">Телефон</option>
          <option value="laptop">Ноутбук</option>
          <option value="misc">Другое</option>
        </select>
        {showTypeError && typeEmpty && (
          <p className="ad-edit-field-error">{requiredFieldMessage('Тип устройства')}</p>
        )}
      </div>

      <label className="ad-edit-label" htmlFor="electronics-brand">
        Бренд
      </label>
      <input
        id="electronics-brand"
        type="text"
        className={optionalControlClass(!form.electronicsParams.brand.trim())}
        value={form.electronicsParams.brand}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: { ...prev.electronicsParams, brand: e.target.value },
          }))
        }
      />

      <label className="ad-edit-label" htmlFor="electronics-model">
        Модель
      </label>
      <input
        id="electronics-model"
        type="text"
        className={optionalControlClass(!form.electronicsParams.model.trim())}
        value={form.electronicsParams.model}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: { ...prev.electronicsParams, model: e.target.value },
          }))
        }
      />

      <label className="ad-edit-label" htmlFor="electronics-condition">
        Состояние
      </label>
      <select
        id="electronics-condition"
        className={optionalControlClass(form.electronicsParams.condition === '')}
        value={form.electronicsParams.condition}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: {
              ...prev.electronicsParams,
              condition: e.target.value as '' | 'new' | 'used',
            },
          }))
        }
      >
        <option value="">Не указано</option>
        <option value="new">Новый</option>
        <option value="used">Б/у</option>
      </select>

      <label className="ad-edit-label" htmlFor="electronics-color">
        Цвет
      </label>
      <input
        id="electronics-color"
        type="text"
        className={optionalControlClass(!form.electronicsParams.color.trim())}
        value={form.electronicsParams.color}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: { ...prev.electronicsParams, color: e.target.value },
          }))
        }
      />
    </>
  )
}
