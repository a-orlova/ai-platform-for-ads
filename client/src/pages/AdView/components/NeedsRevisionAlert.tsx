import ErrorIcon from '@mui/icons-material/Error'

type NeedsRevisionAlertProps = {
  missingFields: string[]
}

export default function NeedsRevisionAlert({ missingFields }: NeedsRevisionAlertProps) {
  if (!missingFields.length) return null

  return (
    <div className="alert-block">
      <div className="alert-message">
        <ErrorIcon className="alert-icon" />
        <div className="alert-content">
          <h4>Требуются доработки</h4>
          <p>У объявления не заполнены поля:</p>
          <ul>
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
