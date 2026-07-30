import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../student/Icon';
import type { DashboardLiveExam } from '../../types/lecturerDashboard';

const formatRemaining = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')} remaining`;
};

type LiveExamCardProps = {
  liveExam: DashboardLiveExam | null;
  loading?: boolean;
};

const LiveExamCard = memo(({ liveExam, loading = false }: LiveExamCardProps) => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(liveExam?.remainingSeconds ?? 0);

  useEffect(() => {
    setSecondsLeft(liveExam?.remainingSeconds ?? 0);
  }, [liveExam?.remainingSeconds]);

  useEffect(() => {
    if (!liveExam) return undefined;
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [liveExam]);

  if (loading) {
    return (
      <section className="lecturer-gradient-brand p-6 sm:p-8 rounded-brand min-h-[200px] animate-pulse opacity-80" />
    );
  }

  if (!liveExam) {
    return null;
  }

  const openLive = () => {
    navigate(`/lecturer/exams/${liveExam.examId}/live`);
  };

  return (
    <section className="lecturer-gradient-brand p-6 sm:p-8 rounded-brand shadow-[0px_10px_30px_rgba(0,0,0,0.05)] relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 bg-student-error text-student-on-error px-3 py-1 rounded-full text-student-label-md font-student font-bold pulse-live">
                <span className="w-2 h-2 bg-white rounded-full" />
                LIVE
              </span>
              <span className="text-student-on-primary-fixed font-bold text-student-headline-sm font-student">
                {formatRemaining(secondsLeft)}
              </span>
            </div>
            <h3 className="text-student-headline-md font-student text-student-on-primary-fixed font-extrabold tracking-tight">
              {liveExam.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={openLive}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-3 rounded-full text-student-on-primary-fixed transition-colors shrink-0"
            aria-label="Open live monitoring"
          >
            <Icon name="open_in_full" />
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Active', value: liveExam.activeStudents, tone: 'text-student-primary' },
            { label: 'High Risk', value: liveExam.highRiskCount, tone: 'text-student-error' },
            {
              label: 'Avg Score',
              value: `${Math.round(liveExam.avgIntegrityScore)}%`,
              tone: 'text-student-primary',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/90 px-5 py-3 rounded-2xl flex flex-col min-w-[100px]">
              <span className="text-student-label-md font-student text-student-on-surface-variant uppercase font-bold tracking-widest">
                {stat.label}
              </span>
              <span className={`text-student-headline-md font-student font-black ${stat.tone}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-student-primary/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
});

LiveExamCard.displayName = 'LiveExamCard';

export default LiveExamCard;
