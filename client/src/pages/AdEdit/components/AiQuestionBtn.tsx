import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import RefreshIcon from '@mui/icons-material/Refresh'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import React from 'react'

type AiRequestState = 'idle' | 'loading' | 'completed'
type AiQuestionBtnMode = 'description' | 'price'

type AiDescriptionBtnProps = {
  mode: AiQuestionBtnMode
  descriptionValue?: string
  state?: AiRequestState
  onClick?: () => void | Promise<void>
}

export default function AiDescriptionBtn({ mode,
                                           descriptionValue = '',
                                           state,
                                           onClick,
                                        }: AiDescriptionBtnProps) {
  const [internalState, setInternalState] = React.useState<AiRequestState>('idle')
  const currentState = state ?? internalState

  const isDescriptionEmpty = descriptionValue.trim().length === 0

  const buttonConfig = React.useMemo(() => {
    if (currentState === 'loading') {
      return {
        text: 'Выполняется запрос',
        icon: <HourglassBottomIcon className="ai-question-btn-loading-icon" />,
      }
    }

    if (currentState === 'completed') {
      return {
        text: 'Повторить запрос',
        icon: <RefreshIcon />,
      }
    }

    if (mode === 'price') {
      return {
        text: 'Узнать рыночную цену',
        icon: <TipsAndUpdatesIcon />,
      }
    }

    return {
      text: isDescriptionEmpty ? 'Придумать описание' : 'Улучшить описание',
      icon: <TipsAndUpdatesIcon />,
    }
  }, [currentState, isDescriptionEmpty, mode])

  const handleClick = async () => {
    if (currentState === 'loading') return
    if (state !== undefined) {
      await onClick?.()
      return
    }

    setInternalState('loading')
    try {
      await onClick?.()
      if (!onClick) {
        await new Promise((resolve) => window.setTimeout(resolve, 800))
      }
    } finally {
      setInternalState('completed')
    }
  }

  return (
    <button className="ai-question-btn" type="button" onClick={handleClick} disabled={currentState === 'loading'}>
      {buttonConfig.icon}
      {buttonConfig.text}
    </button>
  )
}