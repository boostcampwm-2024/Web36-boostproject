import { MENU, MENU_TITLE } from '@/constants/constants'
import { X } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import logo from '@/assets/logo.svg'
import TableTool from '@/components/TableTool'
import { TableType } from '@/types/interfaces'
import TestQueryTool from './TestTool'

type LeftSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeItem: (typeof MENU)[0]
  setActiveItem: React.Dispatch<React.SetStateAction<(typeof MENU)[0]>>
  tables: TableType[]
}

export default function LeftSidebar({
  activeItem,
  setActiveItem,
  tables,
  ...props
}: LeftSidebarProps) {
  const menu = MENU.slice(0, -1)
  const { setOpen, toggleSidebar } = useSidebar()

  const handleClick = (item: (typeof MENU)[0]) => {
    setActiveItem(item)
    if (activeItem.title === item.title) {
      toggleSidebar()
    } else {
      setOpen(true)
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <div className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r">
        <SidebarHeader className="pt-3.5">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
            <img src={logo} alt="logo" className="size-9" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {menu?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => handleClick(item)}
                      isActive={activeItem.title === item.title}
                    >
                      <item.icon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
      <Sidebar
        collapsible="none"
        className="sticky hidden flex-1 overflow-auto md:flex"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <button
              type="button"
              className="text-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="fill-current" />
            </button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {activeItem.title === MENU_TITLE.TABLE && (
                <TableTool tableData={tables} />
              )}
              {activeItem.title === MENU_TITLE.RECORD && 'record'}
              {activeItem.title === MENU_TITLE.TESTQUERY && <TestQueryTool />}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
