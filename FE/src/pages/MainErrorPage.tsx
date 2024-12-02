import { Button } from '@/components/ui/button'

type ErrorPageProps = {
  resetErrorBoundary: () => void
}

export default function MainErrorPage({ resetErrorBoundary }: ErrorPageProps) {
  return (
    <div className="flex w-full min-w-[20vw] items-center justify-center border-x">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">Oops!</h1>
        <p className="my-4 text-sm">Something went wrong. Please try again.</p>
        <Button
          variant="secondary"
          className="h-8"
          onClick={resetErrorBoundary}
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
