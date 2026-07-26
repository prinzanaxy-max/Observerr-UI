import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ExamSessionHeader from '../components/student/exam/ExamSessionHeader';
import ExamQuestionPanel from '../components/student/exam/ExamQuestionPanel';
import ExamSessionNav from '../components/student/exam/ExamSessionNav';
import IntegrityCalibrationOverlay from '../components/student/exam/IntegrityCalibrationOverlay';
import IntegrityMonitorErrorBoundary from '../components/student/exam/IntegrityMonitorErrorBoundary';
import ProctoringStatusBanner from '../components/student/exam/ProctoringStatusBanner';
import { useIntegrityMonitor } from '../hooks/useIntegrityMonitor';
import { useIntegrityScore } from '../hooks/useIntegrityScore';
import { useIntegritySessionSync } from '../hooks/useIntegritySessionSync';
import { getStudentExamDetail } from '../data/studentExamSessionData';
import type { IntegrityEvent } from '../types/integrityMonitoring';

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
};

type ExamSessionWithMonitorProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  examContainerRef: RefObject<HTMLDivElement | null>;
  onIntegrityEvent: (event: IntegrityEvent) => void;
  integrityScore: number;
  calibrationDone: boolean;
  onCalibrationDone: () => void;
  onProctoringUnavailable: () => void;
  sessionError?: string | null;
  children: React.ReactNode;
};

function ExamSessionWithMonitor({
  videoRef,
  examContainerRef,
  onIntegrityEvent,
  integrityScore,
  calibrationDone,
  onCalibrationDone,
  onProctoringUnavailable,
  sessionError,
  children,
}: ExamSessionWithMonitorProps) {
  const monitor = useIntegrityMonitor({
    videoRef,
    examContainerRef,
    enabled: true,
    onIntegrityEvent,
    blockClipboard: true,
  });

  useEffect(() => {
    if (monitor.status === 'unavailable' || monitor.status === 'permission_denied') {
      onProctoringUnavailable();
      onCalibrationDone();
    }
  }, [monitor.status, onCalibrationDone, onProctoringUnavailable]);

  const showCalibration =
    !calibrationDone &&
    monitor.status !== 'unavailable' &&
    monitor.status !== 'permission_denied';

  const bannerStatus = useMemo(() => {
    if (monitor.status === 'permission_denied') return 'permission_denied' as const;
    if (monitor.status === 'unavailable') return 'unavailable' as const;
    if (!calibrationDone || monitor.status === 'loading') return 'loading' as const;
    return 'monitoring' as const;
  }, [calibrationDone, monitor.status]);

  return (
    <div ref={examContainerRef} className="student-exam-pre h-dvh flex flex-col font-student text-student-on-surface antialiased">
      {/* Hidden capture — landmarks only; raw video never sent to backend */}
      <video ref={videoRef} className="sr-only" aria-hidden playsInline muted />

      {showCalibration && (
        <IntegrityCalibrationOverlay
          onCalibrate={monitor.calibrate}
          onComplete={onCalibrationDone}
        />
      )}

      <ProctoringStatusBanner
        status={bannerStatus}
        integrityScore={integrityScore}
        message={monitor.error ?? sessionError}
      />

      {children}
    </div>
  );
}

const StudentExamSessionPage = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const id = Number(examId);
  const exam = Number.isNaN(id) ? undefined : getStudentExamDetail(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const examContainerRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef('');
  const proctoringAvailableRef = useRef(true);
  const sessionStartedLoggedRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [calibrationDone, setCalibrationDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    exam ? exam.durationMinutes * 60 : 0,
  );

  const {
    score: integrityScore,
    handleIntegrityEvent,
    logSessionEvent,
    buildSummary,
    getAuditLog,
    requiresReview,
    setSessionStartedAt,
  } = useIntegrityScore(id, sessionIdRef);

  const handleSessionReady = useCallback(
    (session: { sessionId: string; startedAt: string }) => {
      sessionIdRef.current = session.sessionId;
      setSessionStartedAt(session.startedAt);
      if (!sessionStartedLoggedRef.current) {
        sessionStartedLoggedRef.current = true;
        logSessionEvent(
          'SESSION_STARTED',
          'Exam session started',
          `Backend session ${session.sessionId} opened for exam ${id}.`,
        );
      }
    },
    [id, logSessionEvent, setSessionStartedAt],
  );

  const { submitSession, sessionError } = useIntegritySessionSync({
    examId: id,
    enabled: !Number.isNaN(id) && id > 0,
    getAuditLog,
    onSessionReady: handleSessionReady,
  });

  const finalizeSession = useCallback(async () => {
    logSessionEvent('SESSION_ENDED', 'Exam session ended', 'Student submitted or timed out.');
    const summary = buildSummary(proctoringAvailableRef.current);
    await submitSession(summary, getAuditLog());
  }, [buildSummary, getAuditLog, logSessionEvent, submitSession]);

  useEffect(() => {
    if (exam) {
      document.title = `Exam — ${exam.title} | Observerr`;
      setSecondsLeft(exam.durationMinutes * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (!exam || submitted || !calibrationDone) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          void finalizeSession();
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [exam, submitted, calibrationDone, finalizeSession]);

  const questions = exam?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] ?? '' : '';

  const answeredCount = useMemo(
    () => questions.filter((q) => (answers[q.id] ?? '').trim().length > 0).length,
    [questions, answers],
  );

  const handleAnswerChange = useCallback((value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  const handleSubmit = useCallback(() => {
    void finalizeSession();
    setSubmitted(true);
  }, [finalizeSession]);

  const handleCalibrationDone = useCallback(() => {
    setCalibrationDone(true);
    logSessionEvent(
      'CALIBRATION_COMPLETE',
      'Gaze calibration complete',
      'Baseline head pose captured for gaze deviation detection.',
    );
  }, [logSessionEvent]);

  if (!exam) {
    return <Navigate to="/student/exams" replace />;
  }

  if (exam.availability !== 'ready') {
    return <Navigate to={`/student/exams/${exam.id}`} replace />;
  }

  if (submitted) {
    return (
      <div className="student-exam-pre h-dvh flex flex-col items-center justify-center px-6 font-student text-center">
        <div className="max-w-md w-full student-exam-glass-card rounded-[24px] p-8">
          <h1 className="text-student-headline-md font-student text-student-on-surface mb-3">Exam submitted</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-2">
            You answered {answeredCount} of {questions.length} questions.
          </p>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-2">
            Integrity score: {integrityScore}%
            {requiresReview && (
              <span className="block text-amber-700 mt-1">Your session has been flagged for review.</span>
            )}
          </p>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-8">
            Your responses have been recorded. Results will appear when your instructor publishes them.
          </p>
          <button
            type="button"
            onClick={() => navigate('/student/exams')}
            className="w-full py-3 rounded-full student-exam-btn-primary text-student-on-primary font-student font-bold"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <Navigate to={`/student/exams/${exam.id}`} replace />;
  }

  return (
    <IntegrityMonitorErrorBoundary>
      <ExamSessionWithMonitor
        videoRef={videoRef}
        examContainerRef={examContainerRef}
        onIntegrityEvent={handleIntegrityEvent}
        integrityScore={integrityScore}
        calibrationDone={calibrationDone}
        onCalibrationDone={handleCalibrationDone}
        onProctoringUnavailable={() => {
          proctoringAvailableRef.current = false;
        }}
        sessionError={sessionError}
      >
        <ExamSessionHeader
          title={exam.title}
          courseCode={exam.courseCode}
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          timeRemaining={formatTime(secondsLeft)}
          examId={exam.id}
        />

        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 pb-28 student-hide-scrollbar">
          <div className="max-w-[900px] mx-auto">
            <div className="sm:hidden mb-4 flex items-center gap-2 text-student-label-md font-student text-student-on-surface-variant">
              <span className="px-3 py-1 rounded-full bg-student-surface-container-high">
                {formatTime(secondsLeft)} remaining
              </span>
              <span>{answeredCount}/{questions.length} answered</span>
            </div>

            <ExamQuestionPanel
              question={currentQuestion}
              answer={currentAnswer}
              onAnswerChange={handleAnswerChange}
            />

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {questions.map((q, idx) => {
                const hasAnswer = (answers[q.id] ?? '').trim().length > 0;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-9 h-9 rounded-full text-sm font-student font-semibold transition-colors ${
                      idx === currentIndex
                        ? 'bg-student-primary text-student-on-primary'
                        : hasAnswer
                          ? 'bg-student-primary-container text-student-on-primary-container'
                          : 'bg-student-surface-container-high text-student-on-surface-variant hover:bg-student-surface-container'
                    }`}
                    aria-label={`Go to question ${q.number}`}
                  >
                    {q.number}
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        <ExamSessionNav
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canSubmit={answeredCount > 0}
        />
      </ExamSessionWithMonitor>
    </IntegrityMonitorErrorBoundary>
  );
};

export default StudentExamSessionPage;
