import { useState } from 'react'
import { MENU } from '@/constants'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import ShellList from '@/components/ShellList'
import { useShells } from '@/hooks/useShellQuery'

export default function Page() {
  const { data: shells = [], isLoading, error } = useShells()
  const [activeItem, setActiveItem] = useState(MENU[0])

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <LeftSidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-2.5">
          <h2 className="h-full pt-1 text-2xl font-bold text-foreground">
            Q-Lab
          </h2>
        </header>
        {!isLoading && !error && <ShellList shells={shells} />}
      </SidebarInset>
      <RightSidebar />
    </SidebarProvider>
  )
}
