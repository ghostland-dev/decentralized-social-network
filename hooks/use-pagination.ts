import { useState, useCallback, useMemo } from 'react'

interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
  totalItems?: number
}

interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
  startIndex: number
  endIndex: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface PaginationActions {
  setPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setPageSize: (size: number) => void
  setTotalItems: (total: number) => void
  reset: () => void
}

export function usePagination(options: PaginationOptions = {}): [PaginationState, PaginationActions] {
  const {
    initialPage = 1,
    initialPageSize = 20,
    totalItems: initialTotalItems = 0
  } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [totalItems, setTotalItemsState] = useState(initialTotalItems)

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize))
  }, [totalItems, pageSize])

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize
  }, [currentPage, pageSize])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize - 1, totalItems - 1)
  }, [startIndex, pageSize, totalItems])

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages
  }, [currentPage, totalPages])

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1
  }, [currentPage])

  const setPage = useCallback((page: number) => {
    if (page < 1) {
      setCurrentPage(1)
    } else if (page > totalPages) {
      setCurrentPage(totalPages)
    } else {
      setCurrentPage(page)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasNextPage])

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPreviousPage])

  const setPageSize = useCallback((size: number) => {
    if (size < 1) return
    
    // Calculate new page to maintain similar position
    const currentFirstItem = (currentPage - 1) * pageSize
    const newPage = Math.max(1, Math.floor(currentFirstItem / size) + 1)
    
    setPageSizeState(size)
    setCurrentPage(newPage)
  }, [currentPage, pageSize])

  const setTotalItems = useCallback((total: number) => {
    setTotalItemsState(Math.max(0, total))
    
    // Adjust current page if it's beyond the new total
    const newTotalPages = Math.max(1, Math.ceil(total / pageSize))
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages)
    }
  }, [currentPage, pageSize])

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setPageSizeState(initialPageSize)
    setTotalItemsState(initialTotalItems)
  }, [initialPage, initialPageSize, initialTotalItems])

  const state: PaginationState = {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage
  }

  const actions: PaginationActions = {
    setPage,
    nextPage,
    previousPage,
    setPageSize,
    setTotalItems,
    reset
  }

  return [state, actions]
}

// Hook for infinite scroll pagination
export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: {
    initialData?: T[]
    pageSize?: number
    threshold?: number
  } = {}
) {
  const { initialData = [], pageSize = 20, threshold = 100 } = options
  
  const [items, setItems] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newItems = await loadMore()
      
      if (newItems.length < pageSize) {
        setHasMore(false)
      }
      
      setItems(prev => [...prev, ...newItems])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'))
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, loadMore, pageSize])

  const reset = useCallback(() => {
    setItems(initialData)
    setHasMore(true)
    setError(null)
    setLoading(false)
  }, [initialData])

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore: handleLoadMore,
    reset
  }
}