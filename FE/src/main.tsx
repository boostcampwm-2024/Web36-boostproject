import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </React.StrictMode>
  </QueryClientProvider>
)
