import { Connection } from 'mysql2/promise';

export interface QueryDBAdapter {
  connect(identify: string): Promise<Connection>;
}
