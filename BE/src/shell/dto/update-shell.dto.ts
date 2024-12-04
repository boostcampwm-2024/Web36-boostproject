import { createZodDto } from 'nestjs-zod';
import { UpdateShellDtoSchema } from '../../../../schemas';

class UpdateShellDto extends createZodDto(UpdateShellDtoSchema) {}

export { UpdateShellDto };
