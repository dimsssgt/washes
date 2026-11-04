import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email atau No. WhatsApp wajib diisi")
    .max(100, "Terlalu panjang"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    namaLengkap: z
      .string()
      .min(1, "Nama lengkap wajib diisi")
      .max(100, "Nama terlalu panjang"),
    noWhatsapp: z
      .string()
      .min(1, "No. WhatsApp wajib diisi")
      .regex(/^(\+62|62|0)[0-9]{8,13}$/, "Format No. WhatsApp tidak valid"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(8, "Password minimal 8 karakter"),
    konfirmasiPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Password tidak cocok",
    path: ["konfirmasiPassword"],
  });

export const lupaPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email atau No. WhatsApp wajib diisi")
    .max(100, "Terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LupaPasswordInput = z.infer<typeof lupaPasswordSchema>;
