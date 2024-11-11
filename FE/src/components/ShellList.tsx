import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import { ShellType } from '@/types/interfaces'
import { useAddShell, useDeleteShell } from '@/hooks/useShellQuery'

export default function ShellList({ shells }: { shells: ShellType[] }) {
  const [focusedShell, setFocusedShell] = useState<number | null>(null)
  const addShellMutation = useAddShell()
  const deleteShellMutation = useDeleteShell()

  const addShell = () => {
    const newShell: ShellType = {
      shellId: new Date().getTime(),
      queryStatus: null,
      runTime: null,
      query: null,
      queryType: null,
      failMessage: null,
      affectedRows: null,
      table: null,
    }
    addShellMutation.mutate(newShell)
  }

  const removeShell = (shellId: number) => {
    deleteShellMutation.mutate(shellId)
  }
  return (
    <>
      <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background p-2">
        <Badge variant="outline" className="cursor-pointer" onClick={addShell}>
          + add
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {shells.map((shell) => (
          <Shell
            key={shell.shellId}
            shell={shell}
            removeShell={removeShell}
            focusedShell={focusedShell}
            setFocusedShell={setFocusedShell}
          />
        ))}
      </div>
    </>
  )
}
