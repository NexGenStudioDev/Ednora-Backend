import { z } from 'zod';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const forgotPasswordRequestZodSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email address'),
  })
  .passthrough();

export const validatePasswordResetZodSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please provide a valid email address'),
    otp: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .refine((val) => /^\d{6}$/.test(val), {
        message: 'OTP must be a 6-digit number',
      }),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .trim()
      .min(6, 'Password must be at least 6 characters long'),
  })
  .passthrough();

export const ForgotPasswordRequestValidator = createJoiCompatibleValidator(
  forgotPasswordRequestZodSchema
);

export const ValidatePasswordResetValidator = createJoiCompatibleValidator(
  validatePasswordResetZodSchema
);

export default {
  ForgotPasswordRequestValidator,
  ValidatePasswordResetValidator,
};
