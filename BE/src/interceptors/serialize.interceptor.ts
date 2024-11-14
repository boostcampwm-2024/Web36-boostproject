import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((inputData: any) => {
        let data;
        if (inputData instanceof Array) {
          data = inputData.map((item) =>
            this.removeNullProperties(
              plainToInstance(this.dto, item, {
                excludeExtraneousValues: true,
              }),
            ),
          );
        } else {
          data = this.removeNullProperties(
            plainToInstance(this.dto, inputData, {
              excludeExtraneousValues: true,
            }),
          );
        }

        return {
          status: true,
          data,
          message: '성공적으로 응답되었습니다.',
        };
      }),
    );
  }

  removeNullProperties(obj: any): any {
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(obj).filter(([_, value]) => value !== null),
    );
  }
}
