import { z } from 'zod';

// UpdateShellDto 스키마
export const UpdateShellDtoSchema = z.object({
  query: z.string().nonempty('Query must be a non-empty string'),
});

// 타입 추론
export type UpdateShellDto = z.infer<typeof UpdateShellDtoSchema>;
