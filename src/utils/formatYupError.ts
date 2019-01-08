import { ValidationError } from "yup";

export const formatYupError = (err: ValidationError) => {
  const errors: Array<{ path: string; message: string }> = [];
  err.inner.forEach(el => {
    errors.push({ path: el.path, message: el.message });
  });
  return errors;
};
