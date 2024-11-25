import { useQuery } from 'react-query'
import useCustomMutation from '@/hooks/useCustomMutation'
import {
  fetchShells,
  addShell,
  deleteShell,
  updateShell,
  executeShell,
} from '@/api/shellApi'
import { ShellType } from '@/types/interfaces'
import { QUERY_KEYS } from '@/constants'

export function useShells() {
  return useQuery<ShellType[]>(QUERY_KEYS.SHELLS, fetchShells, {
    refetchOnWindowFocus: false,
  })
}

export function useAddShell() {
  return useCustomMutation(addShell, QUERY_KEYS.SHELLS)
}

export function useDeleteShell() {
  return useCustomMutation(deleteShell, QUERY_KEYS.SHELLS)
}

export function useUpdateShell() {
  return useCustomMutation<
    { id: number; query: string },
    { id: number; query: string }
  >(updateShell, QUERY_KEYS.SHELLS)
}

export function useExecuteShell() {
  return useCustomMutation(executeShell, QUERY_KEYS.SHELLS)
}
