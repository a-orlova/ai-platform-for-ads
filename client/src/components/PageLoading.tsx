type PageLoadingProps = {
  label?: string
}

export default function PageLoading({ label = 'Загружаем страницу....' }: PageLoadingProps) {
  return (
    <div className="page-loading">
      <h1>{label}</h1>
    </div>
  )
}

