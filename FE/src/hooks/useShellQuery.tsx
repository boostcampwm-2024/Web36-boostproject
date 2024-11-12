import {
  useQuery,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from 'react-query'
import { fetchShells, addShell, deleteShell } from '@/api/shellApi'
import { ShellType } from '@/types/interfaces'

const QUERY_KEYS = {
  shells: 'shells',
} as const

type MutationContext = {
  previousShells: ShellType[] | undefined
}

function useShellMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables, MutationContext>
) {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables, MutationContext>(mutationFn, {
    onMutate: (newShell) => {
      const previousShells = queryClient.getQueryData(QUERY_KEYS.shells)

      queryClient.setQueryData<ShellType[]>(QUERY_KEYS.shells, (old) =>
        old ? [...old, newShell as ShellType] : [newShell as ShellType]
      )

      return { previousShells } as MutationContext
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEYS.shells)
    },
    onError: (error, _, context) => {
      if (context?.previousShells) {
        queryClient.setQueryData<ShellType[]>(
          QUERY_KEYS.shells,
          context.previousShells
        )
      }
      console.error(error)
    },
    ...options,
  })
}

export function useShells() {
  return useQuery<ShellType[]>(QUERY_KEYS.shells, fetchShells, {
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
  })
}

export function useAddShell() {
  return useShellMutation(addShell)
}

export function useDeleteShell() {
  return useShellMutation(deleteShell)
}
