import React from 'react'

export function useRequestIdGuard() {
  const requestIdRef = React.useRef(0)

  const nextRequestId = React.useCallback(() => {
    requestIdRef.current += 1
    return requestIdRef.current
  }, [])

  const isLatest = React.useCallback((requestId: number) => requestId === requestIdRef.current, [])

  return { nextRequestId, isLatest }
}

