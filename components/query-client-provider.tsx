"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect, type ComponentType } from "react"

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryClientProviderWrapper({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  const [Devtools, setDevtools] = useState<ComponentType<{ initialIsOpen?: boolean }> | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@tanstack/react-query-devtools")
        .then((d) => {
          setDevtools(() => d.ReactQueryDevtools)
        })
        .catch(() => {
          // Devtools not available
        })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {Devtools && <Devtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
