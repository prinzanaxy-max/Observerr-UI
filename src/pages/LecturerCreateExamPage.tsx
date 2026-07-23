import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import CreateExamPageHeader from '../components/lecturer/CreateExamPageHeader';
import ExamDetailsForm from '../components/lecturer/ExamDetailsForm';
import ExamQuestionsPlaceholder from '../components/lecturer/ExamQuestionsPlaceholder';
import ExamSecuritySettingsPanel from '../components/lecturer/ExamSecuritySettingsPanel';
import {
  CREATE_EXAM_PATH,
  DEFAULT_FORM_STATE,
  type CreateExamFormState,
  type SecuritySettingKey,
} from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const formatDraftLabel = (savedAt: Date | null) => {
  if (!savedAt) return 'Draft not saved yet';
  const mins = Math.max(1, Math.round((Date.now() - savedAt.getTime()) / 60000));
  return mins === 1 ? 'Draft auto-saved 1 min ago' : `Draft auto-saved ${mins} mins ago`;
};

const LecturerCreateExamPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState<CreateExamFormState>(DEFAULT_FORM_STATE);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    document.title = 'Create New Exam — Observerr Lecturer';
    setLastSavedAt(new Date(Date.now() - 2 * 60 * 1000));
  }, []);

  useEffect(() => {
    if (!lastSavedAt) return undefined;
    const id = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(id);
  }, [lastSavedAt]);

  const draftSavedLabel = useMemo(() => formatDraftLabel(lastSavedAt), [lastSavedAt]);

  const handleFormChange = useCallback((updates: Partial<CreateExamFormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleToggleSecurity = useCallback((key: SecuritySettingKey) => {
    setForm((prev) => ({
      ...prev,
      security: { ...prev.security, [key]: !prev.security[key] },
    }));
  }, []);

  const handleSaveDraft = useCallback(() => {
    setLastSavedAt(new Date());
  }, []);

  const handlePublish = useCallback(() => {
    navigate('/lecturer/exams');
  }, [navigate]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      handlePublish();
    },
    [handlePublish],
  );

  return (
    <LecturerPortalLayout
      fullName={fullName}
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ExamDetailsForm form={form} onChange={handleFormChange} />
            <ExamQuestionsPlaceholder />
          </div>

          <div className="lg:col-span-4">
            <ExamSecuritySettingsPanel
              security={form.security}
              draftSavedLabel={draftSavedLabel}
              onToggle={handleToggleSecurity}
            />
          </div>
        </form>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerCreateExamPage;
