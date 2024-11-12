export class ResShellDto {
  /**
   * 쉘 Id
   * @example 1
   */
  id: number;
  /**
   * 저장된 쿼리, 쿼리 생성시에는 없다
   * @example "select * from users;"
   */
  query: string;
}
