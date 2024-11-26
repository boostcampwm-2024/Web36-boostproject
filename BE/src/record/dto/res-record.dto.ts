import {Expose} from 'class-transformer';

export class ResRecordDto {
    /**
     * 전체 데이터 삽입 성공 여부
     * @example true
     */
    @Expose()
    status: boolean;

    /**
     * 사용자에게 보여줄 결과 텍스트
     * @example "user 에 랜덤 레코드 100개 삼입되었습니다."
     */
    @Expose()
    text: string;


    constructor(partial: Partial<ResRecordDto>) {
        Object.assign(this, partial);
    }
}
