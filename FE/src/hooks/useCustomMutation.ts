import { useMutation, UseMutationOptions, useQueryClient } from 'react-query'

type MutationContext<TData> = {
  previousData: TData[] | undefined
}

export default function useCustomMutation<TData, TVariables extends TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: string | string[],
  options?: UseMutationOptions<TData, Error, TVariables, MutationContext<TData>>
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables, MutationContext<TData>>(
    mutationFn,
    {
      onMutate: async (newData: TVariables) => {
        const previousData = queryClient.getQueryData<TData[]>(queryKey)

        queryClient.setQueryData<TData[]>(queryKey, (old = []) => [
          ...old,
          newData,
        ])

        return { previousData }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey)
      },
      onError: (error, _, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
        console.error(error)
      },
      ...options,
    }
  )
}
