'use client'

import * as React from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import AppSidebar from '@/components/AppSidebar'

export default function Page() {
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
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <h2 className="h-full text-base BoldM-none">Q-Lab</h2>
        </header>
        <div className="sticky top-0 flex shrink-0 items-center gap-3 border-b bg-background p-2">
          <Badge variant="outline">+ add shell</Badge>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4" />
      </SidebarInset>
    </SidebarProvider>
  )
}
