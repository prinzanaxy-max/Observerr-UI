import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthProfile } from '../hooks/useAuthProfile';
import { useLecturerStudents } from '../hooks/useLecturerStudents';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentsTable from '../components/lecturer/StudentsTable';
import CustomSelect from '../components/shared/CustomSelect';
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

  return (
    <LecturerPortalLayout
      institutionalId={institutionalId}
      email={email}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="bg-gradient-to-b from-student-surface-container to-student-background"
    >
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto w-full pb-12">
        <div className="mb-6">
          <h1 className="text-student-headline-md font-student font-semibold text-student-on-surface">Students</h1>
          <p className="text-student-body-md font-student text-student-on-surface-variant mt-1">Review enrolled students and their exam status.</p>
        </div>
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 px-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student"
            placeholder="Search students..."
            aria-label="Search students"
          />
          <CustomSelect
            value={courseFilter}
            onChange={handleCourseChange}
            options={courseOptions}
            aria-label="Filter by course"
            className="sm:w-56"
          />
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
