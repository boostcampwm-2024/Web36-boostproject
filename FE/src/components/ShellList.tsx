import { Badge } from '@/components/ui/badge'
import Shell from '@/components/Shell'
import { ShellType } from '@/types/interfaces'
import useShellHandlers from '@/hooks/useShellHandler'
import CapacityUsage from './CapacityUsage'

function ButtonGroup({ onAddShell }: { onAddShell: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="cursor-pointer" onClick={onAddShell}>
        + query
      </Badge>
    </div>
  )
}

export default function ShellList({ shells = [] }: { shells: ShellType[] }) {
  const { addShell } = useShellHandlers()

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between border-b bg-background p-2">
        {/* 버튼 그룹 */}
        <ButtonGroup onAddShell={addShell} />

        {/* 점유율 컴포넌트 */}
        <CapacityUsage used={400} total={1000} unit="GB" />
      </div>
      {shells.length > 0 && (
        <div className="flex flex-1 flex-col gap-3 p-4">
          {shells.map((shell) => (
            <Shell key={shell.id} shell={shell} />
          ))}
        </div>
      )}
    </>
  )
}
