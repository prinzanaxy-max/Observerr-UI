import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerStudents } from '../hooks/useLecturerStudents';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentsPageHeader from '../components/lecturer/StudentsPageHeader';
import StudentsTable from '../components/lecturer/StudentsTable';
import Icon from '../components/student/Icon';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const LecturerStudentsPage = () => {
  const navigate = useNavigate();
  const { institutionalId, email, initials } = useAuthProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');

  const {
    students,
    from,
    to,
    totalElements,
    totalPages,
    page,
    courseOptions,
    loading,
    error,
    forbidden,
    setPage,
    reload,
  } = useLecturerStudents(searchQuery, courseFilter);

  useEffect(() => {
    document.title = 'Students — Observerr Lecturer';
  }, []);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleCourseChange = useCallback((value: string) => setCourseFilter(value), []);
  const handleGoLive = useCallback(() => navigate('/lecturer/exams'), [navigate]);

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="bg-gradient-to-b from-student-surface-container to-student-background"
      header={
        <StudentsPageHeader
          initials={initials}
          searchQuery={searchQuery}
          courseFilter={courseFilter}
          courseOptions={courseOptions}
          onSearchChange={handleSearchChange}
          onCourseChange={handleCourseChange}
          onGoLive={handleGoLive}
        />
      }
    >
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
        <div className="md:hidden mb-6 space-y-4">
          <h1 className="text-student-headline-md font-student font-semibold text-student-on-surface">Students</h1>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student"
            placeholder="Search students..."
            aria-label="Search students"
          />
          <select
            value={courseFilter}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full px-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student"
            aria-label="Filter by course"
          >
            {courseOptions.map((course) => (
              <option key={course.value} value={course.value}>{course.label}</option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="text-center py-16 px-6 rounded-[24px] student-glass-card">
            <Icon name={forbidden ? 'block' : 'error'} className="text-[48px] text-student-outline mb-4 mx-auto" />
            <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">
              {forbidden ? 'Access denied' : 'Could not load students'}
            </h2>
            <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">{error}</p>
            {!forbidden && (
              <button
                type="button"
                onClick={() => void reload()}
                className="px-5 py-2 rounded-full border border-student-primary text-student-primary text-student-body-md font-student hover:bg-student-primary/5"
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <StudentsTable
            students={students}
            page={page}
            totalPages={totalPages}
            from={from}
            to={to}
            totalElements={totalElements}
            loading={loading}
            onPageChange={setPage}
          />
        )}
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerStudentsPage;
