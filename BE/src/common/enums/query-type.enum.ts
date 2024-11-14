export const QueryType = {
  CREATE: 'CREATE',
  ALTER: 'ALTER',
  DROP: 'DROP',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SELECT: 'SELECT',
  UNKNOWN: 'UNKNOWN',
} as const;

export type QueryType = (typeof QueryType)[keyof typeof QueryType];
