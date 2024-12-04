import { Button } from '@/components/ui/button'

type SidebarErrorPageProps = {
  resetErrorBoundary: () => void
}

export default function SidebarErrorPage({
  resetErrorBoundary,
}: SidebarErrorPageProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-secondary p-4 text-muted-foreground">
      <h2 className="text-xl font-semibold text-primary">Oops!</h2>
      <p className="my-2 text-center text-sm">
        Something went wrong in the sidebar.
      </p>
      <Button
        variant="outline"
        className="mt-4 h-8 text-sm"
        onClick={resetErrorBoundary}
      >
        Reload Sidebar
      </Button>
    </div>
  )
}
