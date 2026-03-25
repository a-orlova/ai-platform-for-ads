export type AiTooltipVariant = 'normal' | 'error'

type AiTooltipProps = {
  variant: AiTooltipVariant
  text: string
  onAttach?: () => void
  onClose?: () => void
  showAttachButton?: boolean
}

export default function AiTooltip({
  variant,
  text,
  onAttach,
  onClose,
  showAttachButton = true,
}: AiTooltipProps) {
  const isError = variant === 'error'

  return (
    <div className={`ai-tooltip ${isError ? 'fail' : ''}`}>
      {!isError ? (
        <>
          <h5>Ответ AI:</h5>
          <p>{text}</p>
          {showAttachButton ? (
            <button type="button" className="ai-tooltip-attach-btn" onClick={onAttach}>
              Применить
            </button>
          ) : null}
        </>
      ) : (
        <>
          <h5>Произошла ошибка при запросе к AI</h5>
          <p>{text || 'Попробуйте повторить запрос или закройте уведомление'}</p>
        </>
      )}
      <button
        type="button"
        className={`ai-tooltip-close-btn ${isError ? 'fail' : ''}`}
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  )
}