import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useCreateExam } from '../hooks/useCreateExam';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import CreateExamPageHeader from '../components/lecturer/CreateExamPageHeader';
import ExamDetailsForm from '../components/lecturer/ExamDetailsForm';
import ExamQuestionsPlaceholder from '../components/lecturer/ExamQuestionsPlaceholder';
import ExamSecuritySettingsPanel from '../components/lecturer/ExamSecuritySettingsPanel';
import Icon from '../components/student/Icon';
import {
  CREATE_EXAM_PATH,
  DEFAULT_FORM_STATE,
  type CreateExamFormState,
  type SecuritySettingKey,
} from '../data/createExamData';

const formatDraftLabel = (savedAt: Date | null) => {
  if (!savedAt) return 'Draft not saved yet';
  const mins = Math.max(1, Math.round((Date.now() - savedAt.getTime()) / 60000));
  return mins === 1 ? 'Draft auto-saved 1 min ago' : `Draft auto-saved ${mins} mins ago`;
};

const LecturerCreateExamPage = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();
  const { publishExam, submitting, error, forbidden, clearError } = useCreateExam();

  const [form, setForm] = useState<CreateExamFormState>(DEFAULT_FORM_STATE);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    document.title = 'Create New Exam — Observerr Lecturer';
  }, []);

  useEffect(() => {
    if (!lastSavedAt) return undefined;
    const id = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(id);
  }, [lastSavedAt]);

  const draftSavedLabel = useMemo(() => formatDraftLabel(lastSavedAt), [lastSavedAt]);

  const handleFormChange = useCallback(
    (updates: Partial<CreateExamFormState>) => {
      clearError();
      setForm((prev) => ({ ...prev, ...updates }));
    },
    [clearError],
  );

  const handleToggleSecurity = useCallback((key: SecuritySettingKey) => {
    setForm((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: !prev.security[key] },
    }));
  }, []);

  const handleSaveDraft = useCallback(() => {
    setLastSavedAt(new Date());
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await publishExam(form);
    },
    [form, publishExam],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="create-exam-bg relative"
      header={
        <CreateExamPageHeader
          initials={initials}
          onSaveDraft={handleSaveDraft}
          draftSavedLabel={draftSavedLabel}
        />
      }
    >
      <div className="create-exam-ambient pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
        <div className="md:hidden mb-6 flex items-center justify-between gap-4">
          <h1 className="text-student-headline-md font-student font-bold text-student-on-surface">Create New Exam</h1>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-student-primary font-student text-student-body-md font-medium shrink-0"
          >
            Save Draft
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-student-error-container/30 border border-student-error/30 flex items-start gap-3">
            <Icon name={forbidden ? 'block' : 'error'} className="text-student-error shrink-0 mt-0.5" />
            <p className="text-student-body-md font-student text-student-on-error-container">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ExamDetailsForm form={form} onChange={handleFormChange} />
            <ExamQuestionsPlaceholder />
          </div>

          <div className="lg:col-span-4">
            <ExamSecuritySettingsPanel
              security={form.security}
              draftSavedLabel={draftSavedLabel}
              submitting={submitting}
              onToggle={handleToggleSecurity}
            />
          </div>
        </form>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerCreateExamPage;
