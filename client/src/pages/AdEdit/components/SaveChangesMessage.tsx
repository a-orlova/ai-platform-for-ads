import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

type SaveChangesMessageProps = {
  isFailed?: boolean
}

export default function SaveChangesMessage({ isFailed = false }: SaveChangesMessageProps) {
  return (
    <div className={`save-changes-message ${isFailed ? 'failed' : ''}`}>
      {isFailed ? <CancelIcon /> : <CheckCircleIcon />}
      {isFailed ? (
        <>
          <p>Ошибка сохранения</p>
          <p>При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.</p>
        </>
      ) : (
        <p>Изменения сохранены</p>
      )}
    </div>
  )
}