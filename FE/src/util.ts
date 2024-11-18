import { v4 as uuidv4 } from 'uuid'

export default function generateKey(obj: Record<string, unknown>) {
  if (!obj.id) return JSON.stringify(obj.id)
  return `${JSON.stringify(obj)}-${uuidv4}`
}
