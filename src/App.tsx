import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { Board } from '@/components/Board'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-dvh pt-12 pb-16">
        <header className="px-10 pb-8">
          <h1 className="text-[34px] font-semibold leading-none tracking-[-0.02em]">
            Tododo
          </h1>
        </header>
        <Board />
      </main>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}
