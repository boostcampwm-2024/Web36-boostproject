'use client'

import * as React from 'react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import ShellList from '@/components/ShellList'
// import { ShellType } from '@/types/interfaces'
import { useShells } from '@/hooks/useShellQuery'

export default function Page() {
  const { data: shells = [], isLoading, error } = useShells()
  // const shells: ShellType[] = []

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '350px',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-3.5">
          <h2 className="h-full text-xl font-bold text-foreground">Q-Lab</h2>
        </header>
        {/* {!isLoading && !error && <ShellList shells={shells} />} */}
        <ShellList shells={shells} />
      </SidebarInset>
    </SidebarProvider>
  )
}
