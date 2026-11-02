import { z } from 'zod';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const testimonialZodSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, 'Name is required'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Email must be valid'),
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(1, 'Message is required'),
    job_Role: z
      .string({ required_error: 'Job role is required' })
      .trim()
      .min(1, 'Job role is required'),
    star: z
      .union([z.number(), z.string()])
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0 && val <= 5, {
        message: 'Star rating must be a number between 0 and 5',
      }),
  })
  .passthrough();

export const TestimonialValidator = createJoiCompatibleValidator(testimonialZodSchema);

export default TestimonialValidator;
