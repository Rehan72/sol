import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.string(),
  termOfService: z.boolean().optional(),
});

export const onboardingSchema = z.object({
  location: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  state: z.string(),
  city: z.string(),
  pincode: z.string().length(6),
  propertyType: z.string(),
  roofType: z.string(),
  roofArea: z.number(),
  billRange: z.string(),
  solarType: z.string(),
});
