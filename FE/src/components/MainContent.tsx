import { Badge } from '@/components/ui/badge'
import CapacityUsage from '@/components/CapacityUsage'
import Shell from '@/components/common/shell/Shell'
import { useShells } from '@/hooks/query/useShellQuery'
import useUsages from '@/hooks/query/useUsageQuery'
import useShellHandlers from '@/hooks/useShellHandler'
import LoadingPage from '@/pages/LoadingPage'

import { ErrorBoundary } from 'react-error-boundary'
import ShellErrorFallback from './common/shell/ShellErrorFallback'

export default function MainContent() {
  const shells = useShells()
  const usages = useUsages()
  const { addShell } = useShellHandlers()

  return (
    <>
      <div className="sticky top-0 z-50 flex flex-col border-b bg-white">
        <header className="flex items-center gap-2 p-2.5">
          <h2 className="text-3xl font-bold text-foreground">Q-Lab</h2>
        </header>
        <div className="flex items-center justify-between border-t p-2 px-4">
          <Badge
            variant="outline"
            className="cursor-pointer"
            onClick={async () => {
              await addShell()
            }}
          >
            + query
          </Badge>
          <CapacityUsage
            usage={usages.data || { currentUsage: 0, availUsage: 0 }}
          />
        </div>
      </div>
      {shells.isLoading ? (
        <LoadingPage />
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-4">
          {shells.data?.map((shell) => (
            <ErrorBoundary
              key={shell.id}
              FallbackComponent={ShellErrorFallback}
              onReset={() => window.location.reload()}
            >
              <Shell key={shell.id} shell={shell} />
            </ErrorBoundary>
          ))}
        </div>
      )}
    </>
  )
}
