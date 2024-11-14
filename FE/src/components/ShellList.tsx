import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import { ShellType } from '@/types/interfaces'
import {
  useAddShell,
  useDeleteShell,
  useUpdateShell,
} from '@/hooks/useShellQuery'

export default function ShellList({ shells = [] }: { shells: ShellType[] }) {
  const [focusedShell, setFocusedShell] = useState<number | null>(null)
  const addShellMutation = useAddShell()
  const deleteShellMutation = useDeleteShell()
  const updateShellMutation = useUpdateShell()

  const addShell = () => {
    const newShell: Partial<ShellType> = {}
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
          + add
        </Badge>
      </div>
      {shells.length > 0 && (
        <div className="flex flex-1 flex-col gap-3 p-4">
          {shells?.map((shell) => (
            <Shell
              key={uuidv4()}
              shell={shell}
              removeShell={removeShell}
              updateShell={updateShell}
              focusedShell={focusedShell}
              setFocusedShell={setFocusedShell}
            />
          ))}
        </div>
      )}
    </>
  )
}
