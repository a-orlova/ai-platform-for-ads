import { useParams } from 'react-router-dom'

export default function AdEdit() {
  const { id } = useParams()

  return (
    <div>Редактирование объявления {id}</div>
  )
}