import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LecturerPortalLayout from '../components/lecturer/LecturerPortalLayout';
import StudentsPageHeader from '../components/lecturer/StudentsPageHeader';
import StudentsTable from '../components/lecturer/StudentsTable';
import { STUDENT_ROSTER } from '../data/lecturerStudentsData';
import { CREATE_EXAM_PATH } from '../data/createExamData';

const PAGE_SIZE = 10;

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LecturerStudentsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [page, setPage] = useState(1);

  const fullName = user?.fullName ?? localStorage.getItem('authFullName') ?? 'Dr. Ama Boateng';
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    document.title = 'Students — Observerr Lecturer';
  }, []);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STUDENT_ROSTER.filter((student) => {
      if (courseFilter !== 'all' && !student.course.startsWith(courseFilter)) return false;
      if (!q) return true;
      return (
        student.name.toLowerCase().includes(q) ||
        student.id.includes(q) ||
        student.course.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, courseFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, courseFilter]);

  const handleSearchChange = useCallback((value: string) => setSearchQuery(value), []);
  const handleCourseChange = useCallback((value: string) => setCourseFilter(value), []);
  const handlePageChange = useCallback((p: number) => setPage(p), []);
  const handleGoLive = useCallback(() => navigate('/lecturer/exams'), []);

  return (
    <LecturerPortalLayout
      fullName={fullName}
      initials={initials}
      onNewExam={() => navigate(CREATE_EXAM_PATH)}
      contentClassName="bg-gradient-to-b from-student-surface-container to-student-background"
      header={
        <StudentsPageHeader
          initials={initials}
          searchQuery={searchQuery}
          courseFilter={courseFilter}
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
        </div>

        <StudentsTable
          students={paginatedStudents}
          page={page}
          pageSize={PAGE_SIZE}
          total={filteredStudents.length}
          onPageChange={handlePageChange}
        />
      </div>
    </LecturerPortalLayout>
  );
};

export default LecturerStudentsPage;
