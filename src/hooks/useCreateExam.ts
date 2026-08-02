import { AxiosError } from 'axios';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateExamFormState } from '../data/createExamData';
import { buildCreateExamRequest, validateCreateExamForm } from '../lib/lecturerExamsUtils';
import * as lecturerExamsService from '../services/lecturerExamsService';
import useAuthStore from '../store/authStore';

export function useCreateExam() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const submittingRef = useRef(false);

  const publishExam = useCallback(
    async (form: CreateExamFormState) => {
      if (submittingRef.current) return false;
      const validationError = validateCreateExamForm(form);
      if (validationError) {
        setError(validationError);
        return false;
      }

      submittingRef.current = true;
      setSubmitting(true);
      setError('');
      setForbidden(false);

      try {
        await lecturerExamsService.createLecturerExam(buildCreateExamRequest(form, true));
        navigate('/lecturer/exams');
        return true;
      } catch (err) {
        if (err instanceof AxiosError) {
          const status = err.response?.status;
          const message =
            typeof err.response?.data === 'string'
              ? err.response.data
              : (err.response?.data as { message?: string } | undefined)?.message;

          if (status === 401) {
            clearAuth();
            navigate('/auth', { replace: true });
            return false;
          }
          if (status === 403) {
            setForbidden(true);
            setError('You do not have permission to create exams.');
            return false;
          }
          if (status === 400 && message) {
            setError(message);
            return false;
          }
        }
        setError('Could not publish exam. Please try again.');
        return false;
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [clearAuth, navigate],
  );

  return {
    publishExam,
    submitting,
    error,
    forbidden,
    clearError: () => setError(''),
  };
}
