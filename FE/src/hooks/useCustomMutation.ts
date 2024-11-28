import { useMutation, UseMutationOptions, useQueryClient } from 'react-query'
import useToastErrorHandler from '@/error/toastErrorHandler'

type MutationContext<TData> = {
  previousData: TData[] | undefined
}

export default function useCustomMutation<TData, TVariables extends TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: string | string[],
  options?: UseMutationOptions<TData, Error, TVariables, MutationContext<TData>>
) {
  const queryClient = useQueryClient()
  const handleErrorHandler = useToastErrorHandler()

  return useMutation<TData, Error, TVariables, MutationContext<TData>>(
    mutationFn,
    {
      onMutate: () => {
        const previousData = queryClient.getQueryData<TData[]>(queryKey)
        return { previousData }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey)
      },
      onError: (error, _, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
        handleErrorHandler(error)
      },
      ...options,
    }
  )
}
