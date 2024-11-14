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
  return useQuery<ShellType[]>(QUERY_KEYS.shells, fetchShells, {
    // staleTime: 5 * 60 * 1000, // 5분
    // cacheTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
  })
}

export function useAddShell() {
  return useCustomMutation(addShell, QUERY_KEYS.shells)
}

export function useDeleteShell() {
  return useCustomMutation(deleteShell, QUERY_KEYS.shells)
}

export function useUpdateShell() {
  return useCustomMutation(updateShell, QUERY_KEYS.shells)
}

export function useExecuteShell() {
  return useCustomMutation(executeShell, QUERY_KEYS.shells)
}
