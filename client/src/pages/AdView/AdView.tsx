import { useNavigate, useParams } from 'react-router-dom'

export default function AdView() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div>
      <h2>Объявление {id}</h2>

      <button onClick={() => navigate(`/ads/${id}/edit`)}>
        Редактировать
      </button>
    </div>
  )
}