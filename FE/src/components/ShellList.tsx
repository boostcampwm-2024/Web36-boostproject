import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import ShellType from '@/types/interfaces'

interface ShellListType {
  shells: ShellType[]
  setShells: React.Dispatch<React.SetStateAction<ShellType[]>> // useState의 setState 함수 타입
}

export default function ShellList({ shells, setShells }: ShellListType) {
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

    setShells((prevShells) => [...prevShells, newShell])
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
          <Shell key={shell.shellId} />
        ))}
      </div>
    </>
  )
}
