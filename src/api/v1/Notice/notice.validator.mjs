import { z } from 'zod';
import { formatZodError } from '../../../utils/zod.utils.mjs';

export const createNoticeSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(250, 'Title cannot exceed 250 characters'),
  content: z
    .string({ required_error: 'Notice content is required' })
    .trim()
    .min(5, 'Notice content must be at least 5 characters long'),
  type: z
    .enum(['Event', 'Holiday', 'Announcement', 'General'], {
      errorMap: () => ({ message: 'Type must be Event, Holiday, Announcement, or General' }),
    })
    .default('General'),
  target: z
    .string()
    .trim()
    .default('All Students & Faculty'),
  priority: z
    .string()
    .trim()
    .toLowerCase()
    .refine((val) => ['urgent', 'high', 'normal', 'low'].includes(val), {
      message: 'Priority must be urgent, high, normal, or low',
    })
    .default('normal'),
  doc_link: z
    .string()
    .nullable()
    .optional(),
  expiryDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const validateCreateNotice = (data) => {
  // Normalize incoming field variations (e.g. noticeContent -> content)
  const normalizedData = {
    ...data,
    content: data.content || data.noticeContent || '',
    type: data.type
      ? data.type.charAt(0).toUpperCase() + data.type.slice(1).toLowerCase()
      : 'General',
  };

  const result = createNoticeSchema.safeParse(normalizedData);
  if (!result.success) {
    throw new Error(formatZodError(result.error));
  }
  return result.data;
};

export default {
  createNoticeSchema,
  validateCreateNotice,
};

