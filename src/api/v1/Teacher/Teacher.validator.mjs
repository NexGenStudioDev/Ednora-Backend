import { z } from 'zod';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const teacherZodSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Email is invalid'),
    role: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    Specialization: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    department: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    designation: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    qualification: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    phone: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    Experience: z
      .union([z.number(), z.string()])
      .optional()
      .nullable()
      .or(z.literal('')),
    instagram: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    facebook: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    linkedin: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    twitter: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
  })
  .passthrough();

export const Teacher_validation = createJoiCompatibleValidator(teacherZodSchema);

export default Teacher_validation;
