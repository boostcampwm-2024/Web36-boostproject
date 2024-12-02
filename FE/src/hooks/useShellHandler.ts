import {
  useAddShell,
  useDeleteShell,
  useExecuteShell,
  useUpdateShell,
} from '@/hooks/query/useShellQuery'
import { ShellType } from '@/types/interfaces'

export default function useShellHandlers() {
  const addShellMutation = useAddShell()
  const deleteShellMutation = useDeleteShell()
  const executeShellMutation = useExecuteShell()
  const updateShellMutation = useUpdateShell()

  const addShell = async () => {
    const newShell: ShellType = {
      id: Date.now(), // 임시키
      queryStatus: null,
      query: null,
      queryType: null,
      text: null,
      resultTable: null,
    }
    const addedShell = await addShellMutation.mutateAsync(newShell)
    return addedShell
  }

  const deleteShell = (id: number) => {
    deleteShellMutation.mutate(id)
  }

  const executeShell = async (shell: ShellType) => {
    if (!shell.id) return
    await executeShellMutation.mutateAsync(shell)
  }

  const updateShell = async ({ id, query }: { id: number; query: string }) => {
    await updateShellMutation.mutateAsync({ id, query })
  }

  return {
    addShell,
    deleteShell,
    executeShell,
    updateShell,
  }
}
