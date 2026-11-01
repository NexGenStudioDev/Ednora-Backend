import Joi from 'joi';
import { z } from 'zod';
import { formatZodError } from '../../../utils/zod.utils.mjs';

// Legacy Joi SignUp Validator
export const SignUp_Validator = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a valid email',
    'any.required': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),

  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),

  confirm_Password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Confirm Password must match Password',
      'any.required': 'Confirm Password is required',
    }),
});

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
