export const QueryType = {
  CREATE: 'CREATE',
  ALTER: 'ALTER',
  DROP: 'DROP',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SELECT: 'SELECT',
} as const;

export type QueryType = (typeof QueryType)[keyof typeof QueryType];
