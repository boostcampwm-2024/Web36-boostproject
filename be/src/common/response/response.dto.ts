export class ResponseDto {
  status: boolean;
  data: object;

  /**
   * 응답 메세지
   * @example '성공적으로 응답되었습니다.'
   */
  message: string;

  private constructor(status: boolean, data: object, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static ok(data: object): ResponseDto {
    return new ResponseDto(true, data, '성공적으로 응답되었습니다.');
  }
}
