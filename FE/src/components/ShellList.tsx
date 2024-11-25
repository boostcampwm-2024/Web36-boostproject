import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import { ShellType } from '@/types/interfaces'
import useShellHandlers from '@/hooks/useShellHandler'

export default function ShellList({ shells = [] }: { shells: ShellType[] }) {
  const { addShell } = useShellHandlers()

  return (
    <>
      <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background p-2">
        <Badge variant="outline" className="cursor-pointer" onClick={addShell}>
          + query
        </Badge>
      </div>
      {shells.length > 0 && (
        <div className="flex flex-1 flex-col gap-3 p-4">
          {shells?.map((shell) => <Shell key={shell.id} shell={shell} />)}
        </div>
      )}
    </>
  )
}
