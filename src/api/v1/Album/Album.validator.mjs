import { z } from 'zod';
import { createJoiCompatibleValidator } from '../../../utils/zod.utils.mjs';

export const albumZodSchema = z
  .object({
    albumName: z
      .string({ required_error: 'Album name is required' })
      .trim()
      .min(1, 'Album name cannot be empty'),
    albumImageUrl: z
      .string({ required_error: 'Album Image Url is required' })
      .trim()
      .min(1, 'Album Image Url is required'),
    albumDescription: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(5, 'Description must be at least 5 characters')
      .max(255, 'Description must be at most 255 characters'),
  })
  .passthrough();

export const Create_Album_Validator = createJoiCompatibleValidator(albumZodSchema);

export default Create_Album_Validator;
