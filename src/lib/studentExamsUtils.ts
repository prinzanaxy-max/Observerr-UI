import type { UpcomingExam } from '../data/studentDashboardData';
import type {
  ExamAvailability,
  ExamQuestion,
  StudentExamDetail,
} from '../data/studentExamSessionData';
import type { ExamIconTone, ExamListTab, StudentExam } from '../data/studentExamsData';
import type { ApiStudentExamStatus, StudentExamDto } from '../types/studentExams';

const DEFAULT_INSTRUCTIONS = [
  'Ensure you are in a quiet, well-lit room.',
  'Close all unauthorized applications and tabs.',
  'Have a valid photo ID ready for verification.',
];

const parseScheduleParts = (schedule: string, startAt: string, endAt: string) => {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const timeRange =
    !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
      ? `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
      : schedule;

  const comma = schedule.indexOf(',');
  const date = comma >= 0 ? schedule.slice(0, comma).trim() : schedule.split('•')[0]?.trim() ?? schedule;

  return { date, timeRange };
};

const iconForCourse = (courseCode: string): { icon: string; iconTone: ExamIconTone } => {
  const code = courseCode.toUpperCase();
  if (code.includes('CS') || code.includes('COMP')) return { icon: 'code', iconTone: 'secondary' };
  if (code.includes('PHY') || code.includes('SCI')) return { icon: 'science', iconTone: 'tertiary' };
  if (code.includes('MATH') || code.includes('CALC')) return { icon: 'calculate', iconTone: 'error' };
  return { icon: 'assignment', iconTone: 'secondary' };
};

const normalizeStatus = (status: string): ApiStudentExamStatus => {
  const upper = status.toUpperCase();
  if (upper === 'LIVE' || upper === 'UPCOMING' || upper === 'COMPLETED') {
    return upper;
  }
  return 'UPCOMING';
};

const mapToTab = (status: ApiStudentExamStatus): ExamListTab =>
  status === 'COMPLETED' ? 'completed' : 'upcoming';

const mapAvailability = (dto: StudentExamDto): ExamAvailability => {
  const status = normalizeStatus(dto.status);
  if (status === 'COMPLETED') return 'completed';
  if (dto.attempted && !dto.canTake) return 'completed';
  if (status === 'LIVE' && dto.canTake) return 'ready';
  return 'locked';
};

export function mapStudentExamDtoToCard(dto: StudentExamDto): StudentExam {
  const status = normalizeStatus(dto.status);
  const { date, timeRange } = parseScheduleParts(dto.schedule, dto.startAt, dto.endAt);
  const { icon, iconTone } = iconForCourse(dto.courseCode);

  let statusLabel: string;
  let statusTone: StudentExam['statusTone'] = 'neutral';
  let action: StudentExam['action'];
  let highlight = false;

  if (status === 'LIVE') {
    if (dto.attempted && !dto.canTake) {
      statusLabel = 'Submitted';
      statusTone = 'neutral';
      action = { type: 'view-results', label: 'View Results' };
      highlight = false;
    } else if (dto.canTake) {
      statusLabel = dto.attempted && dto.allowRetake ? 'Retake available' : 'Live now';
      statusTone = 'urgent';
      action = {
        type: 'waiting-room',
        label: dto.attempted && dto.allowRetake ? 'Retake Exam' : 'Enter Exam',
      };
      highlight = true;
    } else {
      statusLabel = 'In progress';
      statusTone = 'neutral';
      action = { type: 'disabled', label: 'Not available yet' };
      highlight = false;
    }
  } else if (status === 'UPCOMING') {
    statusLabel = 'Upcoming';
    action = { type: 'guidelines', label: 'View Details' };
  } else {
    statusLabel = 'Completed';
    action = { type: 'view-results', label: 'View Results' };
  }

  return {
    id: dto.id,
    title: dto.title,
    professor: dto.courseLabel || dto.courseName,
    date,
    timeRange,
    icon,
    iconTone,
    statusLabel,
    statusTone,
    action,
    tab: mapToTab(status),
    highlight,
    resultId: dto.resultId,
  };
}

export function mapStudentExamDtoToDetail(dto: StudentExamDto): StudentExamDetail {
  const card = mapStudentExamDtoToCard(dto);
  const availability = mapAvailability(dto);
  const { date, timeRange } = parseScheduleParts(dto.schedule, dto.startAt, dto.endAt);

  let availableAtLabel = 'Not available yet';
  let beginLabel = 'Begin Exam';

  if (availability === 'ready') {
    availableAtLabel = dto.attempted && dto.allowRetake
      ? 'Retake allowed by your lecturer'
      : 'Ready to start';
    beginLabel = dto.attempted && dto.allowRetake ? 'Retake Exam' : 'Begin Exam';
  } else if (availability === 'completed') {
    availableAtLabel = dto.attempted && normalizeStatus(dto.status) === 'LIVE'
      ? 'Already submitted — retakes are not allowed'
      : 'Exam completed';
    beginLabel = 'Back to exams';
  } else if (normalizeStatus(dto.status) === 'UPCOMING') {
    availableAtLabel = `Opens ${dto.schedule}`;
  }

  return {
    ...card,
    courseCode: dto.courseCode,
    examType: dto.title,
    durationMinutes: dto.durationMinutes,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    availability,
    availableAtLabel,
    beginLabel,
    instructions: DEFAULT_INSTRUCTIONS,
    questions: (dto.questions ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((question, index): ExamQuestion => ({
        id: question.id,
        number: index + 1,
        text: question.text,
        type: 'multiple-choice',
        options: question.options.map((option) => option.text),
        optionKeys: question.options.map((option) => option.key),
        points: question.points,
      })),
    date,
    timeRange,
  };
}

export function mapStudentExamDtoToUpcoming(dto: StudentExamDto): UpcomingExam | null {
  const status = normalizeStatus(dto.status);
  if (status === 'COMPLETED') return null;

  const { date, timeRange } = parseScheduleParts(dto.schedule, dto.startAt, dto.endAt);
  const { icon } = iconForCourse(dto.courseCode);

  return {
    id: dto.id,
    title: dto.title,
    courseCode: dto.courseCode,
    professor: dto.courseName,
    date,
    time: timeRange,
    icon,
    badge: {
      label: status === 'LIVE'
        ? (dto.attempted && !dto.canTake
          ? 'Submitted'
          : dto.canTake
            ? (dto.attempted && dto.allowRetake ? 'Retake available' : 'Live now')
            : 'In progress')
        : 'Upcoming',
      tone: status === 'LIVE' && dto.canTake ? 'urgent' : 'upcoming',
    },
  };
}
