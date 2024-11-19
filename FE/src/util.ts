import { v4 as uuidv4 } from 'uuid'

export default function generateKey(data: Record<string, unknown> | unknown) {
  if (data !== null && typeof data === 'object' && 'id' in data)
    return `${data.id}-${uuidv4()}`
  return `${JSON.stringify(data)}-${uuidv4()}`
}
