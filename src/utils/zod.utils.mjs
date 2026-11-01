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

export default { formatZodError };

