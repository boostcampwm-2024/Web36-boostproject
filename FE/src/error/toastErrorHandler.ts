import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'

export default function useToastErrorHandler() {
  const { toast } = useToast()

  return (error: AxiosError | Error) => {
    let title: string | undefined
    let description: string | undefined

    if ('isAxiosError' in error && error.isAxiosError) {
      const status = error.response?.status
      const responseData = error.response?.data as {
        error?: { message?: string }
      }

      switch (status) {
        case 429:
          title = 'Server Connection Limit Exceeded'
          description =
            responseData?.error?.message ||
            'The server is currently handling too many requests. Please try again later.'
          break
        case 422:
          title = 'Usage Limit Exceeded'
          description =
            responseData?.error?.message ||
            'You have exceeded your usage limit. Please delete rows or tables and try again.'
          break
        default:
          console.error('Unhandled AxiosError:', error)
          title = `Error ${status || 'Unknown'}`
          description =
            responseData?.error?.message || 'An unknown error occurred.'
      }
    } else {
      console.error('Unhandled Error:', error)
      title = 'An unexpected error occurred'
      description =
        error.message || 'An unknown error occurred. Please try again later.'
    }

    toast({
      variant: 'destructive',
      title,
      description,
    })
  }
}
