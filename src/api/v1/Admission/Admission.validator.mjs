import { z } from 'zod';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const admissionZodSchema = z
  .object({
    firstName: z
      .string({ required_error: 'First Name is required' })
      .trim()
      .min(3, 'First Name must have at least 3 characters'),
    middleName: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    lastName: z
      .string({ required_error: 'Last Name is required' })
      .trim()
      .min(1, 'Last Name cannot be empty'),
    fatherName: z
      .string({ required_error: 'Father Name is required' })
      .trim()
      .min(3, 'Father Name must have at least 3 characters'),
    motherName: z
      .string({ required_error: 'Mother Name is required' })
      .trim()
      .min(3, 'Mother Name must have at least 3 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Please fill a valid email address'),
    contactNumber: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .refine((val) => /^\d{10}$/.test(val), {
        message: 'Mobile Number should have at least 10 digits',
      }),
    dateOfBirth: z
      .union([z.string(), z.date()])
      .refine((val) => Boolean(val), {
        message: 'Date of Birth is required',
      }),
    gender: z
      .string({ required_error: 'Gender is required' })
      .trim()
      .refine(
        (val) => ['Male', 'Female', 'Other'].includes(val),
        { message: 'Gender must be one of the following: Male, Female, or Other' }
      ),
    nationality: z
      .string({ required_error: 'Nationality is required' })
      .trim()
      .min(1, 'Nationality is required'),
    Gname: z
      .string({ required_error: 'Guardian Name is required' })
      .trim()
      .min(1, 'Guardian Name is required'),
    Grelation: z
      .string({ required_error: 'Guardian Relation is required' })
      .trim()
      .min(1, 'Guardian Relation is required'),
    GcontactNumber: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .refine((val) => /^\d{10}$/.test(val), {
        message: 'Guardian Number should have at least 10 digits',
      }),
    street: z
      .string({ required_error: 'Street is required' })
      .trim()
      .min(1, 'Street is required'),
    city: z
      .string({ required_error: 'City is required' })
      .trim()
      .min(1, 'City is required'),
    state: z
      .string({ required_error: 'State is required' })
      .trim()
      .min(1, 'State is required'),
    pinCode: z
      .union([z.string(), z.number()])
      .refine((val) => String(val).length >= 4, {
        message: 'Pincode should be at least 4 digits',
      }),
    AadharCardNumber: z
      .union([z.string(), z.number()])
      .refine((val) => String(val).replace(/\D/g, '').length >= 12, {
        message: 'Aadhar Number should be at least 12 digits',
      }),
    tenthMarks: z
      .union([z.string(), z.number()])
      .refine((val) => Number(val) >= 0, {
        message: 'Tenth Marks should be a valid number',
      }),
    tenthBoard: z
      .string({ required_error: '10th Board Name is required' })
      .trim()
      .min(1, '10th Board Name is required')
      .transform((val) => val.toUpperCase()),
    tenthGrade: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    twelfthMarks: z
      .union([z.string(), z.number()])
      .refine((val) => Number(val) >= 0, {
        message: 'Twelfth Marks should be a valid number',
      }),
    twelfthBoard: z
      .string({ required_error: '12th Board Name is required' })
      .trim()
      .min(1, '12th Board Name is required')
      .transform((val) => val.toUpperCase()),
    twelfthGrade: z
      .string()
      .trim()
      .optional()
      .nullable()
      .or(z.literal('')),
    mode: z
      .string({ required_error: 'mode is required' })
      .trim()
      .refine((val) => ['Online', 'Offline'].includes(val), {
        message: 'Mode must be Online or Offline',
      }),
    university: z
      .string({ required_error: 'university is required' })
      .trim()
      .min(1, 'university is required')
      .transform((val) => val.toUpperCase()),
    courseName: z
      .string({ required_error: 'Course Name is required' })
      .trim()
      .min(1, 'Course Name is required')
      .transform((val) => val.toUpperCase()),
  })
  .passthrough();

export const AdmissionValidationSchema = createJoiCompatibleValidator(admissionZodSchema);

export default AdmissionValidationSchema;
