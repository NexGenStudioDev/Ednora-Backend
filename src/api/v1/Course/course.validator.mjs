import { z } from 'zod';
import { DepartmentConstant } from './course.constant.mjs';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const courseZodSchema = z
  .object({
    courseName: z
      .string({ required_error: 'Course name is required' })
      .trim()
      .min(3, 'Course name must have at least 3 characters'),
    AdmissionCriteria: z
      .array(z.string().trim().min(1, 'Admission criteria cannot be empty'), {
        required_error: 'Admission criteria are required',
      })
      .min(1, 'At least one admission criterion is required'),
    courseCode: z
      .string({ required_error: 'Course code is required' })
      .trim()
      .min(3, 'Course code must have at least 3 characters'),
    courseDescription: z
      .string({ required_error: 'Course description is required' })
      .trim()
      .min(1, 'Course description cannot be empty'),
    courseDuration: z
      .string({ required_error: 'Course duration is required' })
      .trim()
      .min(1, 'Course duration cannot be empty'),
    courseEligibility: z
      .string({ required_error: 'Course eligibility is required' })
      .trim()
      .min(1, 'Course eligibility cannot be empty'),
    courseThumbnail: z
      .string({ required_error: 'Course thumbnail URL is required' })
      .trim()
      .min(1, 'Course thumbnail URL cannot be empty'),
    courseLogo: z
      .string()
      .trim()
      .nullable()
      .optional()
      .or(z.literal('')),
    coursePrice: z
      .number({ required_error: 'Course price is required' })
      .min(0, 'Course price cannot be negative'),
    Department: z
      .string({ required_error: 'Department is required' })
      .refine(
        (val) => DepartmentConstant.includes(val),
        {
          message: `Department must be one of the following: ${DepartmentConstant.join(', ')}`,
        }
      ),
  })
  .passthrough();

export const courseValidationSchema = createJoiCompatibleValidator(courseZodSchema);

export default courseValidationSchema;
