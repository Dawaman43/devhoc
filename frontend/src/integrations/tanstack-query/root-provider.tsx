import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// (Optional) Offline persistence disabled to avoid extra dependency.

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
  // Persistence disabled
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
