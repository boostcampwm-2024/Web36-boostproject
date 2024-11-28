import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'

export default function useToastErrorHandler() {
  const { toast } = useToast()

  return (error: AxiosError | Error) => {
    let title
    let description

    if ('isAxiosError' in error && error.isAxiosError) {
      const status = error.response?.status
      switch (status) {
        case 429:
          title = 'Server Connection Limit Exceeded'
          description =
            error.response?.data?.error?.message ||
            'The server is currently handling too many requests. Please try again later.'
          break
        case 422:
          title = 'Usage Limit Exceeded'
          description =
            error.response?.data?.error?.message ||
            'You have exceeded your usage limit. Please delete rows or tables and try again.'
          break
        default:
          console.error('Unhandled AxiosError:', error)
          title = `Error ${status || 'Unknown'}`
          description =
            error.response?.data?.error?.message || 'An unknown error occurred.'
      }
    } else {
      console.error('Unhandled Error:', error)
      title = 'An unexpected error occurred'
      message =
        error.message ||
        error.response?.data?.error?.message ||
        'Please try again later.'
    }

    toast({
      variant: 'destructive',
      title,
      description,
    })
  }
}
