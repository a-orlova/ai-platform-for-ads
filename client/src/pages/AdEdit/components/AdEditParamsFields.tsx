import React from 'react'
import type { AdEditFormState } from '../../../types'

type AdEditParamsFieldsProps = {
  form: AdEditFormState
  setForm: React.Dispatch<React.SetStateAction<AdEditFormState>>
}

export default function AdEditParamsFields({ form, setForm }: AdEditParamsFieldsProps) {
  if (form.category === 'auto') {
    return (
      <>
        <label htmlFor="auto-brand">Марка</label>
        <input
          id="auto-brand"
          type="text"
          value={form.autoParams.brand}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, brand: e.target.value },
            }))
          }
        />

        <label htmlFor="auto-model">Модель</label>
        <input
          id="auto-model"
          type="text"
          value={form.autoParams.model}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, model: e.target.value },
            }))
          }
        />

        <label htmlFor="auto-year">Год выпуска</label>
        <input
          id="auto-year"
          type="number"
          min={1900}
          value={form.autoParams.yearOfManufacture}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, yearOfManufacture: e.target.value },
            }))
          }
        />

        <label htmlFor="auto-transmission">Коробка передач</label>
        <select
          id="auto-transmission"
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

        <label htmlFor="auto-mileage">Пробег</label>
        <input
          id="auto-mileage"
          type="number"
          min={0}
          value={form.autoParams.mileage}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              autoParams: { ...prev.autoParams, mileage: e.target.value },
            }))
          }
        />

        <label htmlFor="auto-engine-power">Мощность двигателя</label>
        <input
          id="auto-engine-power"
          type="number"
          min={0}
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
    return (
      <>
        <label htmlFor="real-estate-type">Тип недвижимости</label>
        <select
          id="real-estate-type"
          value={form.realEstateParams.type}
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

        <label htmlFor="real-estate-address">Адрес</label>
        <input
          id="real-estate-address"
          type="text"
          value={form.realEstateParams.address}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              realEstateParams: { ...prev.realEstateParams, address: e.target.value },
            }))
          }
        />

        <label htmlFor="real-estate-area">Площадь</label>
        <input
          id="real-estate-area"
          type="number"
          min={0}
          value={form.realEstateParams.area}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              realEstateParams: { ...prev.realEstateParams, area: e.target.value },
            }))
          }
        />

        <label htmlFor="real-estate-floor">Этаж</label>
        <input
          id="real-estate-floor"
          type="number"
          min={0}
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

  return (
    <>
      <label htmlFor="electronics-type">Тип устройства</label>
      <select
        id="electronics-type"
        value={form.electronicsParams.type}
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

      <label htmlFor="electronics-brand">Бренд</label>
      <input
        id="electronics-brand"
        type="text"
        value={form.electronicsParams.brand}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: { ...prev.electronicsParams, brand: e.target.value },
          }))
        }
      />

      <label htmlFor="electronics-model">Модель</label>
      <input
        id="electronics-model"
        type="text"
        value={form.electronicsParams.model}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            electronicsParams: { ...prev.electronicsParams, model: e.target.value },
          }))
        }
      />

      <label htmlFor="electronics-condition">Состояние</label>
      <select
        id="electronics-condition"
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

      <label htmlFor="electronics-color">Цвет</label>
      <input
        id="electronics-color"
        type="text"
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
