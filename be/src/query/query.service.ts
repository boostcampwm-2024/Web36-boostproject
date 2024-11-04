import { Injectable } from '@nestjs/common';
import { ResQueryDto } from './dto/res-query.dto';
import { QueryDto } from './dto/query.dto';
import { QueryRepository } from './query.repository';

@Injectable()
export class QueryService {
  constructor(private readonly queryRepository: QueryRepository) {}
  queryExecute(queryDto: QueryDto): ResQueryDto {

  }
}
