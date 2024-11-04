import { Controller } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller('api/shells')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}
}
