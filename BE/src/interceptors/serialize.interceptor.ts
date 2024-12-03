import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface ClassConstructor<T> {
  new (...args: any[]): T;
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
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
    if (!obj) return;
    return Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(obj).filter(([_, value]) => value !== null),
    );
  }
}
