import { MENU_TITLE } from '@/constants/constants'
import { useTables } from '@/hooks/query/useTableQuery'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import LoadingPage from '@/pages/LoadingPage'
import ViewTable from './ViewTable'

export default function RightSidebar() {
  const tables = useTables()

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh max-w-[35vw] border-l lg:flex"
      side="right"
    >
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-base font-medium text-foreground">
            {MENU_TITLE.VIEW}
          </div>
        </div>
      </SidebarHeader>
      {tables.isLoading ? (
        <LoadingPage />
      ) : (
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <ViewTable tableData={tables.data || []} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}
    </Sidebar>
  )
}
