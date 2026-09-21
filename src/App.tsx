import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { Board } from '@/components/Board'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-dvh py-10">
        <h1 className="px-10 pb-6 text-4xl font-bold tracking-tight">Tododo</h1>
        <Board />
      </main>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}
