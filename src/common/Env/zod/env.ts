import * as z from 'zod';
export const envSchema = z.object({
  JWT_PRIVATE_KEY: z
    .string({ error: 'É necessário passar uma chave!' })
    .max(2316, { message: 'Máximo deve ser 2316 caracteres' }),
  JWT_PUBLIC_KEY: z
    .string({ error: 'É necessário passar uma chave!' })
    .max(618, { message: 'Máximo deve ser 2316 caracteres' }),
  DATABASE_URL: z.string(),
  PORT: z.string().default('3002').transform(Number),
  EMAIL_FROM: z.email(),
  EMAIL_PASS: z.string().min(8).max(64),
});
export type EnvType = z.infer<typeof envSchema>;
