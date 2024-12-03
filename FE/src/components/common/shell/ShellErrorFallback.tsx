import { Button } from '@/components/ui/button'

type ShellErrorFallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

export default function ShellErrorFallback({
  error,
  resetErrorBoundary,
}: ShellErrorFallbackProps) {
  return (
    <div className="flex h-auto overflow-hidden rounded-sm bg-secondary shadow-md">
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold text-red-600">Error</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <Button
          variant="outline"
          className="mt-4 px-4 py-2"
          onClick={resetErrorBoundary}
        >
          Retry
        </Button>
      </div>
    </div>
  )
}
