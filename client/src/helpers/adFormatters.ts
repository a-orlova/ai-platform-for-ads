export const formatPrice = (price: number | null) =>
  price === null ? 'Цена не указана' : `${new Intl.NumberFormat('ru-RU').format(price)} ₽`

export const formatDateTime = (value: string) => {
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

export const parseDateValue = (value: string) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
