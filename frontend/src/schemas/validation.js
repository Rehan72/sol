import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'EMAIL IS REQUIRED').email('INVALID EMAIL FORMAT'),
  password: z.string().min(6, 'PASSWORD MUST BE AT LEAST 6 CHARACTERS'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'FULL NAME IS REQUIRED'),
  email: z.string().min(1, 'EMAIL IS REQUIRED').email('INVALID EMAIL FORMAT'),
  phone: z.string().min(10, 'PHONE NUMBER MUST BE AT LEAST 10 DIGITS').regex(/^\d+$/, 'PHONE MUST CONTAIN ONLY NUMBERS'),
  password: z.string().min(6, 'PASSWORD MUST BE AT LEAST 6 CHARACTERS'),
  confirmPassword: z.string().min(6, 'CONFIRM PASSWORD IS REQUIRED'),
  role: z.string().default('CUSTOMER'),
  termOfService: z.boolean().refine(val => val === true, 'YOU MUST ACCEPT THE TERMS'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "PASSWORDS DON'T MATCH",
  path: ["confirmPassword"],
});

export const onboardingSchema = z.object({
  // Location
  location: z.string().min(1, 'PLEASE PICK A LOCATION ON THE MAP'),
  latitude: z.number(),
  longitude: z.number(),
  state: z.string().min(1, 'STATE IS REQUIRED'),
  city: z.string().min(1, 'CITY IS REQUIRED'),
  pincode: z.string().length(6, 'PINCODE MUST BE EXACTLY 6 DIGITS').regex(/^\d+$/, 'PINCODE MUST BE NUMERIC'),
  
  // Property
  propertyType: z.enum(['home', 'shop', 'industrial']),
  roofType: z.enum(['rcc', 'tin_shed', 'open_ground']),
  roofArea: z.coerce.number({ invalid_type_error: 'ROOF AREA IS REQUIRED' }).min(1, 'ROOF AREA IS REQUIRED'),
  
  // Requirement
  billRange: z.string().min(1, 'PLEASE SELECT YOUR AVERAGE MONTHLY BILL'),
  solarType: z.enum(['grid_tied', 'hybrid']),
});
