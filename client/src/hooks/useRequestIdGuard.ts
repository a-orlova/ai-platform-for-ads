import React from 'react'

/**
 * Хелпер для защиты от гонок при асинхронной загрузке:
 * если пришёл более старый запрос — игнорируем результат.
 */
export function useRequestIdGuard() {
  const requestIdRef = React.useRef(0)

  const nextRequestId = React.useCallback(() => {
    requestIdRef.current += 1
    return requestIdRef.current
  }, [])

  const isLatest = React.useCallback((requestId: number) => requestId === requestIdRef.current, [])

  return { nextRequestId, isLatest }
}

