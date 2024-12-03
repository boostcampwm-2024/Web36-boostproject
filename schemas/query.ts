import { z } from "zod";

// QueryDto 스키마
export const QueryDtoSchema = z.object({
  query: z.string(),
});

// 타입 추론
export type QueryDto = z.infer<typeof QueryDtoSchema>;
