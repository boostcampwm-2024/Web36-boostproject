import { Expose } from 'class-transformer';

export class ResShellResultDto {
  @Expose()
  id: number;

  @Expose()
  queryStatus: boolean;

  @Expose()
  runTime: string;

  @Expose()
  query: string;

  @Expose()
  queryType: string;

  @Expose()
  failMessage: string;

  @Expose()
  affectedRows: number;

  @Expose()
  table: object;
}
