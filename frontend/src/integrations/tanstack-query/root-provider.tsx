import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/query-persist-client'
import { set, get, del } from 'idb-keyval'

// True IndexedDB persister using idb-keyval
function createIndexedDbPersister() {
  const key = 'devhoc-query-cache'
  return {
    persistClient: async (client: unknown) => {
      const value = JSON.stringify(client)
      await set(key, value)
    },
    restoreClient: async () => {
      const value = await get<string | null>(key)
      return value ? JSON.parse(value) : undefined
    },
    removeClient: async () => {
      await del(key)
    },
  }
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
