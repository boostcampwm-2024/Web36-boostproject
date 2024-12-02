import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import * as ace from 'ace-builds'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()
ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </React.StrictMode>
  </QueryClientProvider>
)
