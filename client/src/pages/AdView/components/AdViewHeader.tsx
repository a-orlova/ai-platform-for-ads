import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BorderColorIcon from '@mui/icons-material/BorderColor'

type AdViewHeaderProps = {
  title: string
  price: string
  createdAtLabel: string
  updatedAtLabel?: string
  onBack: () => void
  onEdit: () => void
}

export default function AdViewHeader({
  title,
  price,
  createdAtLabel,
  updatedAtLabel,
  onBack,
  onEdit,
}: AdViewHeaderProps) {
  return (
    <div className="ad-view-header">
      <div className="ad-view-title-block">
        <div className="ad-view-title-row">
          <button className="ad-view-back-btn" onClick={onBack} aria-label="Назад к списку">
            <ArrowBackIcon />
          </button>
          <h2>{title}</h2>
        </div>
        <button className="ad-view-edit-btn" onClick={onEdit}>
          Редактировать
          <BorderColorIcon />
        </button>
      </div>
      <div className="ad-view-price-block">
        <h2>{price}</h2>
        <p>Опубликовано {createdAtLabel}</p>
        {updatedAtLabel && <p>Отредактировано {updatedAtLabel}</p>}
      </div>
    </div>
  )
}
