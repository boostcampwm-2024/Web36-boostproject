import { z } from "zod";

// Domains Enum 정의
const Domains = z.enum(["name", "country", "city", "email", "phone", "sex", "boolean", "number", "enum"]);
type Domains = z.infer<typeof Domains>;

// RandomColumnInfo 스키마
export const RandomColumnInfoSchema = z
  .object({
    name: z.string().trim().min(1, "Column Name is required"),
    type: Domains,
    blank: z.number().int().min(0).max(100, "Blank must be between 0 and 100"),
    min: z.number().optional(),
    max: z.number().optional(),
    enum: z
      .array(z.string())
      .max(10, "Enum array can have at most 10 items")
      .optional()
      .refine((val) => val === undefined || Array.isArray(val), {
        message: "Enum must be an array of strings or undefined",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.type === "number") {
      if (data.min === undefined) {
        ctx.addIssue({
          path: ["min"],
          message: "min must be defined when type is 'number'",
          code: "custom",
        });
      }
      if (data.max === undefined) {
        ctx.addIssue({
          path: ["max"],
          message: "max must be defined when type is 'number'",
          code: "custom",
        });
      }
      if (data.min !== undefined && data.max !== undefined && data.min > data.max) {
        ctx.addIssue({
          path: ["min"],
          message: "min must be less than or equal to max",
          code: "custom",
        });
      }
    }

    if (data.type === "enum" && data.enum === undefined) {
      ctx.addIssue({
        path: ["enum"],
        message: "enum must be defined when type is 'enum'",
        code: "custom",
      });
    }
  });

// CreateRandomRecordDto 스키마
export const CreateRandomRecordDtoSchema = z.object({
  tableName: z.string().trim().min(1, "Table name is required"),
  columns: z.array(RandomColumnInfoSchema),
  count: z.number().int().min(1, "Count must be at least 1").max(100000, "Count cannot exceed 100000"),
});

export type RandomColumnInfo = z.infer<typeof RandomColumnInfoSchema>;
export type CreateRandomRecordDto = z.infer<typeof CreateRandomRecordDtoSchema>;
