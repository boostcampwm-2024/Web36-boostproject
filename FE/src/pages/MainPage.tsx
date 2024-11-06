'use client'

import React, { useState } from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import ShellList from '@/components/ShellList'
import ShellType from '@/types/interfaces'
import mocData from '@/mocdata.json'

export default function Page() {
  const [shells, setShells] = useState<ShellType[]>(mocData.result)

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
        <ShellList shells={shells} setShells={setShells} />
      </SidebarInset>
    </SidebarProvider>
  )
}
