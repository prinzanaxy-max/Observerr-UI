import { fetchLecturerExams } from '../services/lecturerExamsService';
import { startLecturerExam } from '../services/lecturerLiveSessionsService';
import type { LecturerExamDto } from '../types/lecturerExams';

export type GoLiveResult =
  | { ok: true; examId: number; started: boolean }
  | { ok: false; message: string };

const byStartAsc = (a: LecturerExamDto, b: LecturerExamDto) =>
  new Date(a.startAt).getTime() - new Date(b.startAt).getTime();

/**
 * Smart Go Live: open an existing LIVE exam, or start the soonest upcoming exam.
 */
export async function resolveAndGoLive(): Promise<GoLiveResult> {
  const data = await fetchLecturerExams({ status: 'ALL' });
  const exams = data.exams ?? [];

  const live = [...exams].filter((exam) => exam.status === 'LIVE').sort(byStartAsc);
  if (live.length > 0) {
    return { ok: true, examId: live[0].id, started: false };
  }

  const upcoming = [...exams]
    .filter((exam) => exam.status === 'UPCOMING' && exam.published !== false)
    .sort(byStartAsc);

  if (upcoming.length === 0) {
    return {
      ok: false,
      message: 'No live or upcoming exams available to go live.',
    };
  }

  const target = upcoming[0];
  await startLecturerExam(target.id);
  return { ok: true, examId: target.id, started: true };
}
