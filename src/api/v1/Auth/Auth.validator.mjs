import { z } from 'zod';
import { formatZodError, createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const signUpZodSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Email must be a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
    confirm_Password: z
      .string({ required_error: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirm_Password, {
    message: 'Confirm Password must match Password',
    path: ['confirm_Password'],
  });

export const SignUp_Validator = createJoiCompatibleValidator(signUpZodSchema);

// Zod Validation Schemas
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password cannot be empty'),
});

export const createAdminSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email('Invalid email address format'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .optional(),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .optional()
    .default('Admin@123'),
  role: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => ['admin', 'super admin', 'super_admin'].includes(val), {
      message: 'Role must be either "admin" or "super admin"',
    })
    .default('admin'),
  designation: z
    .string()
    .trim()
    .optional()
    .default('Campus Administrator'),
});

export const updateAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .optional(),
  role: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => ['admin', 'super admin', 'super_admin'].includes(val), {
      message: 'Role must be either "admin" or "super admin"',
    })
    .optional(),
  designation: z
    .string()
    .trim()
    .optional(),
  isActive: z
    .boolean()
    .optional(),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
});

export const validateLogin = (data) => {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
};

export const validateCreateAdmin = (data) => {
  const result = createAdminSchema.safeParse(data);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
};

export const validateUpdateAdmin = (data) => {
  const result = updateAdminSchema.safeParse(data);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
};

export default {
  SignUp_Validator,
  loginSchema,
  createAdminSchema,
  updateAdminSchema,
  validateLogin,
  validateCreateAdmin,
  validateUpdateAdmin,
};
