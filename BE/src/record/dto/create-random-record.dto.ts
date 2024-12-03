import { createZodDto } from 'nestjs-zod';
import {
  RandomColumnInfo,
  CreateRandomRecordDtoSchema,
} from '../../../../schemas/index';

class CreateRandomRecordDto extends createZodDto(CreateRandomRecordDtoSchema) {}

export { RandomColumnInfo, CreateRandomRecordDto };
