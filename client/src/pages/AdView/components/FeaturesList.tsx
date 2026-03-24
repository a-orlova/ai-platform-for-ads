import type { Category } from '../../../types'

type FeaturesListProps = {
  category: Category
  params: Record<string, unknown>
}

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

const formatParamValue = (value: unknown) => {
  if (typeof value === 'string') return paramValueLabels[value] ?? value
  if (typeof value === 'number') return new Intl.NumberFormat('ru-RU').format(value)
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  return ''
}

export default function FeaturesList({ category, params }: FeaturesListProps) {
  const features = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== '')
    .map(([key, value]) => ({
      label: paramLabels[key] ?? key,
      value: formatParamValue(value),
    }))
    .filter((item) => item.value.length > 0)

  return (
    <div className="features-block">
      <h3>Характеристики</h3>
      {features.length > 0 ? (
        <ul>
          <li>
            <span className="feature-label">Категория</span>
            <span className="feature-value">{categoryLabels[category]}</span>
          </li>
          {features.map((feature) => (
            <li key={feature.label}>
              <span className="feature-label">{feature.label}</span>
              <span className="feature-value">{feature.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Характеристики не заполнены</p>
      )}
    </div>
  )
}
