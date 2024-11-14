import shellResultDataRaw from '@/api/__mocks__/mocdataResult.json'
import { ShellType } from '@/types/interfaces'

const { resultPlain, resultError, resultTableShort, resultTableLong } =
  shellResultDataRaw

export default function getMocResult(shell: ShellType) {
  const { queryStatus, runTime, queryType, table } = shell

  if (queryStatus === false) return resultError
  if (table?.length === 0) return resultPlain
  if (queryType === 'SELECT' && parseFloat(runTime || '0') <= 0.05)
    return resultTableShort

  return resultTableLong
}
