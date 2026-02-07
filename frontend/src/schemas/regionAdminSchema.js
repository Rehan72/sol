import { z } from 'zod';

export const regionAdminSchema = z.object({
    // Profile
    adminName: z.string().min(1, 'Admin Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    mobile: z.string().min(1, 'Mobile is required').regex(/^\d{10}$/, 'Invalid mobile (10 digits)'),
    role: z.string(),
    status: z.enum(['active', 'inactive']),

    // Region Info
    regionName: z.string().min(1, 'Region Name is required'),
    regionCode: z.string().min(1, 'Region Code is required'),
    location: z.string().min(1, 'Location is required'),
    latitude: z.union([z.string(), z.number()]).optional(),
    longitude: z.union([z.string(), z.number()]).optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    utility: z.string().min(1, 'Utility provider is required'),
});

export const defaultValues = {
    adminName: '',
    email: '',
    password: '',
    mobile: '',
    role: 'REGION_ADMIN',
    status: 'active',
    regionName: '',
    regionCode: '',
    location: '',
    latitude: '',
    longitude: '',
    country: '',
    state: '',
    city: '',
    utility: '',
};
