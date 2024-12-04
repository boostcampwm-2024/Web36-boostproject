import { createZodDto } from 'nestjs-zod';
import { QueryDtoSchema } from '../../../../schemas';

class QueryDto extends createZodDto(QueryDtoSchema) {}

export { QueryDto };
