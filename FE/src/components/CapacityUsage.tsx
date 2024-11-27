import { UsageType } from '@/types/interfaces'
import { MAX_ROWS_PER_USER } from '@/constants/constants'
import useUsages from '@/hooks/useUsageQuery'

function CapacityUsage({ usage }: { usage: UsageType }) {
  const { isLoading, isFetching } = useUsages()

  const UNIT = 'Rows'
  const HIGH_THRESHOLD = 70

  const loading = isLoading || isFetching
  const used = usage?.currentUsage || 0
  const total = usage?.availUsage || MAX_ROWS_PER_USER
  const percentage = total > 0 ? (used / total) * 100 : 0

  const getColor = (percent: number) => {
    if (percent < HIGH_THRESHOLD) return 'bg-primary'
    return 'bg-red-500'
  }

  const color = getColor(percentage)

  return (
    <div className="flex max-w-md items-center space-x-4 rounded-lg bg-white">
      {/* 텍스트 영역 */}
      <div className="flex-shrink-0 text-left text-xs font-semibold text-muted-foreground">
        <div className="flex items-center space-x-1">
          {/* 현재 사용량 */}
          {loading ? (
            <div className="mb-0.5 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          ) : (
            <span>{used}</span>
          )}
          {/* 단위 */}
          <span>{UNIT}</span>
          {/* 총 사용량 */}
          <span>
            / {total} {UNIT}
          </span>
        </div>
      </div>

      {/* 게이지 바 */}
      <div className="w-24 flex-grow">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default CapacityUsage
