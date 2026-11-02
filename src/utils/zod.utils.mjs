/**
 * Utility helper for formatting Zod validation errors into user-friendly messages
 */
export const formatZodError = (error) => {
  if (!error) return 'Validation failed';
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors
      .map((err) => {
        const field = err.path && err.path.length > 0 ? err.path.join('.') : 'Field';
        return `${field}: ${err.message}`;
      })
      .join('; ');
  }
  return error.message || 'Validation failed';
};

/**
 * Wraps a Zod schema to provide a Joi-compatible `.validate(data, options)` method
 * returning `{ error, value }`, ensuring full backward compatibility with existing controllers/tests.
 */
export const createJoiCompatibleValidator = (zodSchema) => {
  return {
    schema: zodSchema,
    validate: (data, options = {}) => {
      const result = zodSchema.safeParse(data);
      if (!result.success) {
        const details = result.error.errors.map((err) => ({
          message: err.message,
          path: err.path,
        }));
        const err = new Error(details[0]?.message || 'Validation failed');
        err.details = details;
        return { error: err, value: undefined };
      }
      return { error: null, value: result.data };
    },
    safeParse: (data) => zodSchema.safeParse(data),
    parse: (data) => zodSchema.parse(data),
  };
};

export default { formatZodError, createJoiCompatibleValidator };
