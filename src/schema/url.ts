import { z } from "zod";

const RESERVED_CODES = ["api", "shorten", "urls", "admin", "health", "favicon.ico"];

export const createUrlSchema = z.object({
  originalUrl: z.string().url("URL not valid"),
  customCode: z
    .string()
    .min(3, "Custom code min 3 character")
    .max(10, "Custom code max 10 character")
    .regex(/^[a-zA-Z0-9-_]+$/, "Custom code only contains letters, numbers, and - _ characters")
    .refine((val) => !RESERVED_CODES.includes(val.toLowerCase()), {
      message: "Custom code is already in use by the system",
    })
    .optional(),
  expiresAt: z.coerce.date().optional(),
});

export const updateUrlSchema = z.object({
  isActive: z.boolean().optional(),
  expiresAt: z.coerce.date().nullable().optional(),
});
