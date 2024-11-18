import shellResultDataRaw from '@/api/__mocks__/mocdataResult.json'
import { ShellType } from '@/types/interfaces'

const { resultPlain, resultError, resultTableShort } = shellResultDataRaw

export default function getMocResult(shell: ShellType) {
  const { queryStatus, resultTable } = shell

  if (queryStatus === false) return resultError
  if (resultTable?.length === 0) return resultPlain
  return resultTableShort
}
