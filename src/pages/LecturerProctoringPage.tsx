import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import ProctoringPageHeader from '../components/lecturer/ProctoringPageHeader';
import ProctoringMainFeed from '../components/lecturer/ProctoringMainFeed';
import ProctoringStudentRail from '../components/lecturer/ProctoringStudentRail';
import {
  PROCTORING_EXAMS,
  PROCTORING_FEEDS,
  PROCTORING_TIMER_SECONDS,
  type ProctoringFeed,
} from '../data/proctoringData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerProctoringPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);

  const initialStudentId = searchParams.get('student') ?? PROCTORING_FEEDS[0]?.id ?? '';
  const [selectedExamId, setSelectedExamId] = useState(PROCTORING_EXAMS[0]?.id ?? 1);
  const [selectedFeedId, setSelectedFeedId] = useState(initialStudentId);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioMuted, setAudioMuted] = useState(false);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    document.title = 'Live Proctoring — Observerr Lecturer';
  }, []);

  useEffect(() => {
    const studentParam = searchParams.get('student');
    if (studentParam && PROCTORING_FEEDS.some((feed) => feed.id === studentParam)) {
      setSelectedFeedId(studentParam);
    }
  }, [searchParams]);

  const filteredFeeds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PROCTORING_FEEDS;
    return PROCTORING_FEEDS.filter(
      (feed) =>
        feed.name.toLowerCase().includes(q) ||
        feed.id.includes(q) ||
        feed.liveStatusLabel.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const selectedFeed = useMemo(
    () => PROCTORING_FEEDS.find((feed) => feed.id === selectedFeedId) ?? PROCTORING_FEEDS[0],
    [selectedFeedId],
  );

  useEffect(() => {
    if (filteredFeeds.length > 0 && !filteredFeeds.some((f) => f.id === selectedFeedId)) {
      setSelectedFeedId(filteredFeeds[0].id);
    }
  }, [filteredFeeds, selectedFeedId]);

  const handleSelectFeed = useCallback((feed: ProctoringFeed) => {
    setSelectedFeedId(feed.id);
    setAudioMuted(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleExamChange = useCallback((examId: number) => setSelectedExamId(examId), []);
  const handleToggleAudio = useCallback(() => setAudioMuted((prev) => !prev), []);
  const handleViewTimeline = useCallback(() => {
    if (selectedFeed) {
      navigate(`/lecturer/students/${selectedFeed.id}/timeline`);
    }
  }, [navigate, selectedFeed]);

  if (PROCTORING_EXAMS.length === 0) {
    return (
      <LecturerPortalLayout
        fullName={fullName}
        initials={initials}
        onNewExam={() => navigate(CREATE_EXAM_PATH)}
        contentClassName="lecturer-exams-bg"
      >
        <div className="p-8 max-w-lg mx-auto text-center">
          <h1 className="text-student-headline-md font-student text-student-on-surface mb-2">No live exams</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
            Start or join a live exam session to monitor student feeds.
          </p>
          <button
            type="button"
            onClick={() => navigate('/lecturer/exams')}
            className="px-6 py-3 rounded-full bg-student-primary text-student-on-primary font-student font-bold"
          >
            Go to Exams
          </button>
        </div>
      </LecturerPortalLayout>
    );
  }

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="lecturer-exams-bg"
      header={
        <ProctoringPageHeader
          exams={PROCTORING_EXAMS}
          selectedExamId={selectedExamId}
          initialSeconds={PROCTORING_TIMER_SECONDS}
          onExamChange={handleExamChange}
          initials={initials}
        />
      }
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 min-h-0">
          {selectedFeed && (
            <ProctoringMainFeed
              feed={selectedFeed}
              audioMuted={audioMuted}
              onToggleAudio={handleToggleAudio}
              onViewTimeline={handleViewTimeline}
              onWarn={() => {}}
            />
          )}

          <ProctoringStudentRail
            feeds={filteredFeeds}
            selectedId={selectedFeedId}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelect={handleSelectFeed}
          />
        </div>
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerProctoringPage;
