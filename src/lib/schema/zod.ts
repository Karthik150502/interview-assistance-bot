import { z } from "zod";

export const UserDetailsSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters" })
        .max(100, { message: "Name must be at most 100 characters" })
        .transform((s) => s.trim()),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .transform((s) => s.trim().toLowerCase()),

    phone: z
        .string()
        .trim()
        .regex(/^[+\d\s\-().]*$/, { message: "Phone contains invalid characters" })
        .refine((s) => {
            // count digits only (strip spaces, punctuation)
            const digits = s.replace(/\D/g, "");
            return digits.length >= 7 && digits.length <= 15;
        }, { message: "Phone must contain 7 to 15 digits" }),
}).strict(); // disallow unknown keys
