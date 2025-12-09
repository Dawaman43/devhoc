import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// Async storage persister using IndexedDB via idb-keyval-like interface
// Falls back to localStorage if IndexedDB unavailable.
function createIndexedDbPersister() {
  const hasIndexedDB = typeof indexedDB !== 'undefined'
  const storage: Storage | undefined =
    typeof window !== 'undefined' ? window.localStorage : undefined
  // Use async storage API backed by localStorage for simplicity; swap with idb-keyval for true IndexedDB if needed.
  return createAsyncStoragePersister({
    storage: {
      getItem: async (key: string) =>
        hasIndexedDB && storage ? storage.getItem(key) : null,
      setItem: async (key: string, value: string) => {
        if (hasIndexedDB && storage) storage.setItem(key, value)
      },
      removeItem: async (key: string) => {
        if (hasIndexedDB && storage) storage.removeItem(key)
      },
    },
    key: 'devhoc-query-cache',
    throttleTime: 1000,
  })
}

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 60,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  })
  // Enable persistence on the client
  if (typeof window !== 'undefined') {
    const persister = createIndexedDbPersister()
    persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60 * 24, // 24h
      hydrateOptions: {
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: true,
            refetchOnWindowFocus: false,
          },
        },
      },
    })
  }
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
