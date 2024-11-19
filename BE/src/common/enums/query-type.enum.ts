export const QueryType = {
  CREATE: 'CREATE',
  ALTER: 'ALTER',
  DROP: 'DROP',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SELECT: 'SELECT',
  EXPLAIN: 'EXPLAIN',
  SHOW: 'SHOW',
  TRUNCATE: 'TRUNCATE',
  RENAME: 'RENAME',
  START: 'START',
  COMMIT: 'COMMIT',
  ROLLBACK: 'ROLLBACK',
  SAVEPOINT: 'SAVEPOINT',
  DESCRIBE: 'DESCRIBE',
  SET: 'SET',
  UNKNOWN: 'UNKNOWN', // USE, GRANT, REVOKE
} as const;

export type QueryType = (typeof QueryType)[keyof typeof QueryType];
