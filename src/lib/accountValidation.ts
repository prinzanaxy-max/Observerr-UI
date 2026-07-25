import type { ChangePasswordRequest, UpdateAccountRequest } from '../types/account';

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const PASSWORD_POLICY_HINT =
  'Password must be at least 8 characters and contain at least one letter and one number';

export function validateAccountForm(form: UpdateAccountRequest): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (form.firstName.length > 50) {
    errors.firstName = 'First name must be at most 50 characters';
  }

  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (form.lastName.length > 50) {
    errors.lastName = 'Last name must be at most 50 characters';
  }

  return errors;
}

export function validatePasswordForm(form: ChangePasswordRequest): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!form.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (!PASSWORD_PATTERN.test(form.newPassword)) {
    errors.newPassword = PASSWORD_POLICY_HINT;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (form.currentPassword && form.newPassword === form.currentPassword) {
    errors.newPassword = 'New password must be different from current password';
  }

  return errors;
}
