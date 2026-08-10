import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useCreateExam } from '../hooks/useCreateExam';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import ExamDetailsForm from '../components/lecturer/ExamDetailsForm';
import ExamQuestionEditor from '../components/lecturer/ExamQuestionEditor';
import ExamSecuritySettingsPanel from '../components/lecturer/ExamSecuritySettingsPanel';
import Icon from '../components/student/Icon';
import {
  CREATE_EXAM_PATH,
  DEFAULT_FORM_STATE,
  type CreateExamFormState,
  type SecuritySettingKey,
} from '../data/createExamData';
import { clearExamDraft, readExamDraft, writeExamDraft } from '../lib/examDraft';

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
  const [draftError, setDraftError] = useState('');
  const [, setTick] = useState(0);
  const skipAutosaveRef = useRef(true);
  const draftOwnerRef = useRef(institutionalId);
  const publishedRef = useRef(false);

  useEffect(() => {
    document.title = 'Create New Exam — Observerr Lecturer';
  }, []);

  useEffect(() => {
    const draft = readExamDraft(localStorage, institutionalId);
    draftOwnerRef.current = institutionalId;
    skipAutosaveRef.current = true;
    if (draft) {
      setForm(draft.form);
      setLastSavedAt(draft.savedAt);
    }
  }, [institutionalId]);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return undefined;
    }
    const timer = window.setTimeout(() => {
      if (publishedRef.current) return;
      try {
        setLastSavedAt(writeExamDraft(localStorage, institutionalId, form));
        draftOwnerRef.current = institutionalId;
        setDraftError('');
      } catch {
        setDraftError('This draft could not be saved in this browser.');
      }
    }, 750);
    return () => window.clearTimeout(timer);
  }, [form, institutionalId]);

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
    try {
      setLastSavedAt(writeExamDraft(localStorage, institutionalId, form));
      draftOwnerRef.current = institutionalId;
      setDraftError('');
    } catch {
      setDraftError('This draft could not be saved in this browser.');
    }
  }, [form, institutionalId]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (await publishExam(form)) {
        publishedRef.current = true;
        clearExamDraft(localStorage, draftOwnerRef.current);
        if (draftOwnerRef.current !== institutionalId) clearExamDraft(localStorage, institutionalId);
      }
    },
    [form, institutionalId, publishExam],
  );

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="create-exam-bg relative"
    >
      <div className="create-exam-ambient pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-student-headline-md font-student font-bold text-student-on-surface">Create New Exam</h1>
            <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">Define exam details, add questions, and configure security settings.</p>
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="shrink-0 text-student-primary font-student text-student-body-md font-medium py-2 px-4 rounded-full border border-student-primary hover:bg-student-primary/5 transition-colors"
          >
            {draftSavedLabel === 'Draft not saved yet' ? 'Save Draft' : draftSavedLabel}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-student-error-container/30 border border-student-error/30 flex items-start gap-3">
            <Icon name={forbidden ? 'block' : 'error'} className="text-student-error shrink-0 mt-0.5" />
            <p className="text-student-body-md font-student text-student-on-error-container">{error}</p>
          </div>
        )}
        {draftError && <p role="alert" className="mb-6 text-student-error">{draftError}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ExamDetailsForm form={form} onChange={handleFormChange} />
            <ExamQuestionEditor
              questions={form.questions}
              onChange={(questions) => handleFormChange({ questions })}
            />
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
