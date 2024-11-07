import * as React from 'react'
import PlayCircle from '@/assets/play_circle.svg'
import ShellType from '@/types/interfaces'
import { X } from 'lucide-react'

interface ShellProps {
  shell: ShellType
  removeShell: (shellId: number) => void
  focusedShell: number | null
  setFocusedShell: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Shell({
  shell,
  removeShell,
  focusedShell,
  setFocusedShell,
}: ShellProps) {

  const {
    shellId,
    queryStatus,
    runTime,
    query,
    queryType,
    failMessage,
    affectedRows,
    table,
  } = shell

  const successMessage = `Query OK ${affectedRows} affected (${runTime} sec)`

  const plusButton = (
    <button type="button" className="flex w-full justify-center bg-primary">
      <div className="text-bold w-3 text-background">+</div>
    </button>
  )

  const resultBox = (
    <div className="flex w-full flex-col overflow-hidden rounded-sm bg-secondary">
      <div className="m-3">
        <p>{queryStatus ? successMessage : failMessage}</p>
        {queryType === 'SELECT' && <p>{JSON.stringify(table)}</p>}
      </div>
      {queryType === 'SELECT' && plusButton}
    </div>
  )

  return (
    <>
      <div className="flex h-12 w-full items-center overflow-hidden rounded-sm bg-secondary">
        <button type="button" className="mr-3 h-full w-12 bg-primary p-3">
          <img src={PlayCircle} alt="play button" />
        </button>
        <input
          type="text"
          defaultValue={query ?? ''}
          onFocus={() => setFocusedShell(shellId)}
          className="h-8 w-full border-none bg-secondary p-2 text-base font-medium text-foreground focus:outline-none"
        />
        {focusedShell === shellId && (
          <X
            className="mr-3 fill-current"
            onClick={() => removeShell(shellId)}
          />
        )}
      </div>
      {runTime != null && resultBox}
    </>
  )
}
