import * as z from 'zod';

export const employeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
    password: z.string().optional(), // Optional for edit, required check in component
    designation: z.string().min(1, 'Designation is required'),
    teamName: z.string().optional(),
    documents: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

export const defaultValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    designation: '',
    teamName: '',
    documents: [],
    status: 'active',
};
