import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerProctoring } from '../hooks/useLecturerProctoring';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import ProctoringPageHeader from '../components/lecturer/ProctoringPageHeader';
import ProctoringMainFeed from '../components/lecturer/ProctoringMainFeed';
import ProctoringStudentRail from '../components/lecturer/ProctoringStudentRail';
import type { ProctoringFeed } from '../data/proctoringData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerProctoringPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { institutionalId, email, initials } = useAuthProfile();

  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [selectedFeedId, setSelectedFeedId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [audioMuted, setAudioMuted] = useState(false);

  const { exams, feeds, loading, error, reloadExams } = useLecturerProctoring(selectedExamId);

  useEffect(() => {
    document.title = 'Live Proctoring — Observerr Lecturer';
  }, []);

  useEffect(() => {
    if (exams.length > 0 && selectedExamId === null) {
      setSelectedExamId(exams[0].id);
    }
  }, [exams, selectedExamId]);

  useEffect(() => {
    const studentParam = searchParams.get('student');
    if (studentParam && feeds.some((feed) => feed.id === studentParam)) {
      setSelectedFeedId(studentParam);
    } else if (feeds.length > 0 && !feeds.some((f) => f.id === selectedFeedId)) {
      setSelectedFeedId(feeds[0].id);
    }
  }, [feeds, searchParams, selectedFeedId]);

  const filteredFeeds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return feeds;
    return feeds.filter(
      (feed) =>
        feed.name.toLowerCase().includes(q) ||
        feed.id.includes(q) ||
        feed.liveStatusLabel.toLowerCase().includes(q),
    );
  }, [feeds, searchQuery]);

  const selectedFeed = useMemo(
    () => filteredFeeds.find((feed) => feed.id === selectedFeedId) ?? filteredFeeds[0],
    [filteredFeeds, selectedFeedId],
  );

  const handleSelectFeed = useCallback((feed: ProctoringFeed) => {
    setSelectedFeedId(feed.id);
    setAudioMuted(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleExamChange = useCallback((examId: number) => {
    setSelectedExamId(examId);
    setSelectedFeedId('');
  }, []);
  const handleToggleAudio = useCallback(() => setAudioMuted((prev) => !prev), []);
  const handleViewTimeline = useCallback(() => {
    if (selectedFeed?.sessionId) {
      navigate(`/lecturer/students/sessions/${selectedFeed.sessionId}`);
    }
  }, [navigate, selectedFeed?.sessionId]);

  if (!loading && exams.length === 0) {
    return (
      <LecturerPortalLayout
        institutionalId={institutionalId}
        email={email}
        initials={initials}
        onNewExam={() => navigate(CREATE_EXAM_PATH)}
        contentClassName="lecturer-exams-bg"
      >
        <div className="p-8 max-w-lg mx-auto text-center">
          <h1 className="text-student-headline-md font-student text-student-on-surface mb-2">No live exams</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
            Start or join a live exam session to monitor student feeds.
          </p>
          {error && (
            <p className="text-student-error font-student text-student-body-md mb-4">{error}</p>
          )}
          <button
            type="button"
            onClick={() => void reloadExams()}
            className="mr-3 px-6 py-3 rounded-full border border-student-primary text-student-primary font-student font-bold"
          >
            Retry
          </button>
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
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="lecturer-exams-bg"
      header={
        selectedExamId !== null ? (
          <ProctoringPageHeader
            exams={exams}
            selectedExamId={selectedExamId}
            initialSeconds={0}
            onExamChange={handleExamChange}
            initials={initials}
          />
        ) : undefined
      }
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full pb-12">
        {loading && feeds.length === 0 ? (
          <div className="h-96 rounded-[24px] bg-student-surface-container-high animate-pulse" />
        ) : (
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
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerProctoringPage;
