import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import { ShellType } from '@/types/interfaces'
import {
  useAddShell,
  useDeleteShell,
  useUpdateShell,
} from '@/hooks/useShellQuery'

export default function ShellList({ shells = [] }: { shells: ShellType[] }) {
  const addShellMutation = useAddShell()
  const deleteShellMutation = useDeleteShell()
  const updateShellMutation = useUpdateShell()

  const addShell = () => {
    const newShell: ShellType = {
      id: Date.now(), // 임시키
      queryStatus: null,
      query: null,
      queryType: null,
      text: null,
      resultTable: null,
    }
    addShellMutation.mutate(newShell)
  }

  const removeShell = (id: number) => {
    deleteShellMutation.mutate(id)
  }

  const updateShell = (shell: ShellType) => {
    updateShellMutation.mutate(shell)
  }

  return (
    <>
      <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background p-2">
        <Badge variant="outline" className="cursor-pointer" onClick={addShell}>
          + query
        </Badge>
      </div>
      {shells.length > 0 && (
        <div className="flex flex-1 flex-col gap-3 p-4">
          {shells?.map((shell) => (
            <Shell
              key={shell.id}
              shell={shell}
              removeShell={removeShell}
              updateShell={updateShell}
            />
          ))}
        </div>
      )}
    </>
  )
}
