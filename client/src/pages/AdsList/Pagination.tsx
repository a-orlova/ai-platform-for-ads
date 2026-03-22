type PaginationProps = {
    currentPage: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, 
                                     totalItems, 
                                     itemsPerPage, 
                                     onPageChange }: PaginationProps) {

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        Назад
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            fontWeight: currentPage === page ? 'bold' : 'normal',
            textDecoration: currentPage === page ? 'underline' : 'none'
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Вперёд
      </button>
    </div>
  )
}