// features/addresses/addresses.schema.ts
import { z } from "zod";

export const createAddressSchema = z.object({
  fullName:    z.string().min(2, "Full name is required"),
  addressLine: z.string().min(5, "Address is required"),
  city:        z.string().min(2, "City is required"),
  state:       z.string().optional(),
  country:     z.string().min(2, "Country is required").default("EG"),
  phone:       z.string().optional(),
  zipCode:     z.string().optional(),
  isDefault:   z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial().extend({
  isDefault: z.boolean().default(false),
});

export type CreateAddressBody = z.infer<typeof createAddressSchema>;
export type UpdateAddressBody = z.infer<typeof updateAddressSchema>;