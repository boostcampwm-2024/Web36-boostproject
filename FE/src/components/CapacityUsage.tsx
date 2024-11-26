import { CapacityUsageProps } from '@/types/interfaces'

function CapacityUsage({
  used,
  total,
  unit = 'GB',
  lowThreshold = 70,
  highThreshold = 70,
  isLoading = false, // 로딩 상태 추가
}: CapacityUsageProps) {
  const percentage = !isLoading && total > 0 ? (used / total) * 100 : 0

  const getColor = (percent: number) => {
    if (percent < lowThreshold) return 'bg-primary'
    if (percent < highThreshold) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const color = getColor(percentage)

  return (
    <div className="flex max-w-md items-center space-x-2 rounded-lg bg-white">
      {/* 게이지 바 */}
      <div className="w-24 flex-grow">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex-shrink-0 text-left text-xs font-semibold text-muted-foreground">
        <div className="flex items-center space-x-1">
          {/* 현재 사용량 */}
          {isLoading ? (
            <div className="mb-0.5 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          ) : (
            <span>{used}</span>
          )}
          {/* 단위 */}
          <span>{unit}</span>
          {/* 총 사용량 */}
          <span>
            / {total} {unit}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CapacityUsage
