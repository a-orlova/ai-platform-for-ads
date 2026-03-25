type PageLoadingProps = {
  /**
   * Надпись показывается внутри h1.
   * Оставляем как в макетах/текущей реализации, чтобы не менять поведение UI.
   */
  label?: string
}

export default function PageLoading({ label = 'Загружаем страницу....' }: PageLoadingProps) {
  return (
    <div className="page-loading">
      <h1>{label}</h1>
    </div>
  )
}

