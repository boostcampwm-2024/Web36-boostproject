import { useState } from 'react'
import { MENU } from '@/constants/constants'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import Shell from '@/components/Shell'
import CapacityUsage from '@/components/CapacityUsage'

import useShellHandlers from '@/hooks/useShellHandler'
import { useShells } from '@/hooks/query/useShellQuery'
import { useTables } from '@/hooks/query/useTableQuery'
import useUsages from '@/hooks/query/useUsageQuery'
import { Toaster } from '@/components/ui/toaster'

export default function Page() {
  const {
    data: shells = [],
    isLoading: isShellsLoading,
    error: shellsError,
  } = useShells()

  const {
    data: tables = [],
    isLoading: isTablesLoading,
    error: tablesError,
  } = useTables()

  const { data: usage = { availUsage: 0, currentUsage: 0 } } = useUsages()
  const [activeItem, setActiveItem] = useState(MENU[0])
  const { addShell } = useShellHandlers()

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '400px',
        } as React.CSSProperties
      }
    >
      <LeftSidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        tables={tables}
      />
      <SidebarInset>
        <div className="sticky top-0 z-50 flex flex-col border-b bg-white">
          <header className="flex items-center gap-2 p-2.5">
            <h2 className="text-2xl font-bold text-foreground">Q-Lab</h2>
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
            <CapacityUsage usage={usage} />
          </div>
        </div>
        {!isShellsLoading && !shellsError && shells.length > 0 && (
          <div className="flex flex-1 flex-col gap-3 p-4">
            {shells?.map((shell) => <Shell key={shell.id} shell={shell} />)}
          </div>
        )}
      </SidebarInset>
      {!isTablesLoading && !tablesError && <RightSidebar tables={tables} />}
      <Toaster />
    </SidebarProvider>
  )
}
