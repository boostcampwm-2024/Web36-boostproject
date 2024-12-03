export default function LoadingPage() {
  return (
    <div className="flex h-full min-h-[80vh] min-w-[25vw] flex-col items-center justify-center border-l">
      <div className="mb-4 flex items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
      <p className="text-lg font-semibold text-gray-700">Loading...</p>
    </div>
  )
}
