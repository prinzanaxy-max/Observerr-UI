import { useState, useEffect, useRef } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Status = 'available' | 'soon' | 'upcoming' | 'completed';
type Filter  = 'all' | 'today' | 'week' | 'completed';

interface Exam {
  id: number;
  courseCode: string;
  courseName: string;
  typeLabel: string;
  examTitle: string;
  date: string;
  duration: string;
  questions: number;
  status: Status;
  icon: string;
  actionLabel?: string;
  countdownTarget?: number;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
        aria-hidden="true">{name}</span>
);

const ObserrLogo = ({ className = '' }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
       className={className} aria-hidden="true">
    <path d="M16 2.5L5 7L5 18.5C5 25.2 9.5 29.8 16 31.8C22.5 29.8 27 25.2 27 18.5L27 7Z"
          stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
    <path d="M9 18.5C11.5 14.3 20.5 14.3 23 18.5C20.5 22.7 11.5 22.7 9 18.5Z"
          stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
    <circle cx="16" cy="18.5" r="3.2" fill="#2563EB"/>
    <circle cx="16" cy="18.5" r="1.6" fill="#0F172A"/>
    <circle cx="17.2" cy="17.3" r="0.65" fill="white"/>
    <circle cx="15.2" cy="18.1" r="0.35" fill="white"/>
  </svg>
);

/* ─── Course colours ──────────────────────────────────────────────────────── */
const cc = (code: string) =>
  code.startsWith('CSC') ? { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' }
: code.startsWith('MTH') ? { bg: 'bg-purple-50',  text: 'text-purple-600'  }
: code.startsWith('ENG') ? { bg: 'bg-emerald-50', text: 'text-emerald-600' }
: { bg: 'bg-slate-100', text: 'text-slate-500' };

const typeBadgeColor = (code: string) =>
  code.startsWith('CSC') ? 'bg-[#EFF6FF] text-[#2563EB]'
: code.startsWith('MTH') ? 'bg-purple-50 text-purple-600'
: code.startsWith('ENG') ? 'bg-emerald-50 text-emerald-600'
: 'bg-slate-100 text-slate-500';

/* ─── Live countdown ──────────────────────────────────────────────────────── */
function useCountdown(target?: number) {
  const [left, setLeft] = useState(target ? target - Date.now() : 0);
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target || left <= 0) return '0m 0s';
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1_000);
  return h > 0 ? `${h}h ${m}m ${s.toString().padStart(2,'0')}s` : `${m}m ${s.toString().padStart(2,'0')}s`;
}

/* ─── Exam data ───────────────────────────────────────────────────────────── */
const NOW = Date.now();
const EXAMS: Exam[] = [
  { id:1, courseCode:'CSC 301', courseName:'Computer Networks',  typeLabel:'MIDTERM',      examTitle:'Midterm Examination',    date:'Today, 10:00 AM',    duration:'2 hrs',  questions:40, status:'available', icon:'terminal'    },
  { id:2, courseCode:'MTH 203', courseName:'Linear Algebra',     typeLabel:'QUIZ 3',       examTitle:'Quiz 3',                 date:'Today, 2:00 PM',     duration:'45 min', questions:15, status:'soon',      icon:'calculate',   countdownTarget: NOW + 1.5*60*60*1000 },
  { id:3, courseCode:'ENG 101', courseName:'Technical Writing',  typeLabel:'SEMESTER EXAM',examTitle:'End of Semester Exam',   date:'Tomorrow, 9:00 AM',  duration:'3 hrs',  questions:60, status:'upcoming',  icon:'history_edu', actionLabel:'Starts tomorrow' },
  { id:4, courseCode:'CSC 312', courseName:'Operating Systems',  typeLabel:'LAB',          examTitle:'Lab Assessment',         date:'Friday, 11:00 AM',   duration:'1 hr',   questions:25, status:'upcoming',  icon:'biotech',    actionLabel:'Starts Friday'  },
  { id:5, courseCode:'MTH 201', courseName:'Calculus II',        typeLabel:'',             examTitle:'Mid-Semester Exam',      date:'Last Monday',        duration:'2 hrs',  questions:40, status:'completed', icon:'functions'  },
];

const filterExams = (exams: Exam[], f: Filter) => {
  switch(f) {
    case 'today':     return exams.filter(e => e.date.startsWith('Today'));
    case 'week':      return exams.filter(e => e.status !== 'completed');
    case 'completed': return exams.filter(e => e.status === 'completed');
    default:          return exams;
  }
};

/* ─── Pre-exam modal ──────────────────────────────────────────────────────── */
const CHECKLIST = [
  { icon:'check_circle', text:"Quiet and well-lit private environment",        warning:false },
  { icon:'check_circle', text:'Using latest version of Chrome or Firefox',     warning:false },
  { icon:'check_circle', text:'No external tabs or applications allowed',      warning:false },
  { icon:'check_circle', text:'Copying and pasting is strictly disabled',      warning:false },
  { icon:'check_circle', text:'Fullscreen mode will be required',              warning:false },
  { icon:'warning',      text:'All suspicious actions are automatically recorded', warning:true },
];

const PreExamModal = ({ exam, onClose }: { exam: Exam; onClose: () => void }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', esc); };
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
                     ${show ? 'bg-[#0F172A]/50 backdrop-blur-[3px]' : 'bg-transparent'}`}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white w-full max-w-xl rounded-[2rem] shadow-2xl transition-all duration-300
                       ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#2563EB] mb-4">
              <Icon name="shield" className="text-[40px]" />
            </div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold mb-2">Before you begin</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">{exam.courseCode} — {exam.examTitle}</p>
          </div>

          {/* Checklist */}
          <div className="space-y-3 mb-8">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#C4C7C8]/20"
                   style={{ animationDelay: `${i*100}ms` }}>
                <Icon name={item.icon}
                      className={`text-[20px] flex-shrink-0 ${item.warning ? 'text-amber-500' : 'text-emerald-500'}`} />
                <span className={`text-[14px] font-medium ${item.warning ? 'text-amber-800' : 'text-[#191c1d]'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Warning box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-8">
            <Icon name="warning" className="text-amber-600 text-[22px] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-800 leading-relaxed">
              Observerr is actively monitoring your browser activity. Any violation of academic integrity
              will be flagged automatically to your instructor.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose}
                    className="flex-1 py-3 rounded-full font-semibold text-[#444748] border border-[#C4C7C8]
                               hover:bg-[#F3F4F5] transition-colors text-[14px]">
              Cancel
            </button>
            <button onClick={() => { setLoading(true); setTimeout(() => { window.location.href='/exam-room'; }, 1000); }}
                    disabled={loading}
                    className="flex-[2] py-3 rounded-full bg-[#2563EB] text-white font-semibold text-[14px]
                               hover:bg-[#1D4ED8] active:scale-[0.98] transition-all
                               flex items-center justify-center gap-2 disabled:opacity-70">
              {loading
                ? <><span className="auth-spinner" />Starting…</>
                : <>I Understand — Start Exam <Icon name="arrow_forward" className="text-[18px]" /></>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Countdown cell (used inside card right zone) ───────────────────────── */
const CountdownCell = ({ target }: { target?: number }) => {
  const t = useCountdown(target);
  return <p className="text-[#444748] text-[12px] mt-0.5">Starts in <span className="font-bold">{t}</span></p>;
};

/* ─── Exam card ───────────────────────────────────────────────────────────── */
const ExamCard = ({ exam, onEnter }: { exam: Exam; onEnter: (e: Exam) => void }) => {
  const colors = cc(exam.courseCode);
  const isCompleted = exam.status === 'completed';

  return (
    <div className={`bg-white rounded-[12px] p-6 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)]
                     flex flex-col md:flex-row md:items-center justify-between gap-6
                     hover:shadow-md transition-all duration-200
                     border-l-4 ${
                       exam.courseCode.startsWith('CSC') ? 'border-[#2563EB]'
                     : exam.courseCode.startsWith('MTH') ? 'border-purple-500'
                     : exam.courseCode.startsWith('ENG') ? 'border-emerald-500'
                     : 'border-slate-400'
                     }`}>
      {/* Left: icon + info */}
      <div className={`flex gap-5 items-center ${isCompleted ? 'opacity-80' : ''}`}>
        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} flex-shrink-0`}>
          <Icon name={exam.icon} className="text-[30px]" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-[17px] text-primary leading-tight">
              {exam.courseCode}: {exam.courseName}
            </h3>
            {exam.typeLabel && (
              <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${typeBadgeColor(exam.courseCode)}`}>
                {exam.typeLabel}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-[13px]">
            <span className="flex items-center gap-1.5">
              <Icon name="calendar_today" className="text-[14px]" />{exam.date}
            </span>
            {exam.duration && (
              <span className="flex items-center gap-1.5">
                <Icon name="timer" className="text-[14px]" />{exam.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: status + action */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto flex-shrink-0">
        {/* Status + countdown block */}
        <div>
          {exam.status === 'available' && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold px-3 py-1 bg-emerald-50 rounded-full text-[13px]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Available Now
            </div>
          )}
          {exam.status === 'soon' && (
            <div>
              <div className="flex items-center gap-2 text-red-600 font-bold text-[13px] mb-0.5">
                <span className="w-2 h-2 bg-red-500 rounded-full" />Starting Soon
              </div>
              <CountdownCell target={exam.countdownTarget} />
            </div>
          )}
          {exam.status === 'upcoming' && (
            <div className="flex items-center gap-2 text-amber-500 font-bold px-3 py-1 bg-amber-50 rounded-full text-[13px]">
              Upcoming
            </div>
          )}
          {exam.status === 'completed' && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold px-3 py-1 bg-emerald-50 rounded-full text-[13px]">
              <Icon name="task_alt" className="text-[14px]" />Completed
            </div>
          )}
        </div>

        {/* Action button */}
        {exam.status === 'available' && (
          <button onClick={() => onEnter(exam)}
                  className="bg-[#2563EB] text-white px-6 py-2.5 rounded-full font-semibold text-[13px]
                             flex items-center gap-1.5 hover:bg-[#1D4ED8] active:scale-95 transition-all
                             whitespace-nowrap shadow-sm hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
            Enter Exam <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        )}
        {exam.status === 'soon' && (
          <button disabled
                  className="bg-[#EDEEEF] text-[#444748] px-6 py-2.5 rounded-full font-semibold
                             text-[13px] cursor-not-allowed opacity-60 whitespace-nowrap">
            Locked
          </button>
        )}
        {exam.status === 'completed' && (
          <button className="border border-[#C4C7C8] text-primary px-6 py-2.5 rounded-full font-semibold
                             text-[13px] hover:bg-[#F3F4F5] transition-colors whitespace-nowrap">
            View Results
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Empty state ─────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="bg-white rounded-[12px] py-20 flex flex-col items-center text-center
                  shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)]">
    <Icon name="event_busy" className="text-[64px] text-[#C4C7C8] mb-4" />
    <p className="text-on-surface-variant font-semibold text-[16px] mb-1">No exams here</p>
    <p className="text-[#94A3B8] text-[14px]">Check back later or select a different filter.</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STUDENT DASHBOARD                                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */
const StudentDashboard = () => {
  const [filter, setFilter]       = useState<Filter>('all');
  const [modalExam, setModalExam] = useState<Exam | null>(null);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = 'My Exams — Observerr'; }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const TABS: { key: Filter; label: string }[] = [
    { key:'all',       label:'All'       },
    { key:'today',     label:'Today'     },
    { key:'week',      label:'This Week' },
    { key:'completed', label:'Completed' },
  ];

  const filtered = filterExams(EXAMS, filter);

  return (
    <div className="bg-surface min-h-screen font-body-md text-on-surface">

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 h-20 shadow-sm">
        <div className="flex justify-between items-center h-full px-6 max-w-[1100px] mx-auto">
          {/* Brand */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center">
              <Icon name="visibility" className="text-white text-[22px]" />
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Observerr</span>
          </a>

          {/* Right */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all"
                    aria-label="Notifications">
              <Icon name="notifications" className="text-[22px]" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error border-2 border-white rounded-full" />
            </button>

            <div className="flex items-center gap-4 pl-4 border-l border-outline-variant/50">
              <div className="text-right hidden sm:block">
                <p className="font-headline-md text-[15px] font-semibold text-primary leading-tight">Kofi Atta</p>
                <span className="bg-[#2563EB]/10 text-[#2563EB] text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Student
                </span>
              </div>

              <div className="relative" ref={dropRef}>
                <div className="flex items-center gap-2 group cursor-pointer"
                     onClick={() => setDropOpen(o => !o)}>
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-[13px]">
                    KA
                  </div>
                  <Icon name="keyboard_arrow_down"
                        className={`text-on-surface-variant text-[20px] transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`} />
                </div>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-outline-variant/30
                                  shadow-lg py-1.5 z-50 overflow-hidden">
                    {[
                      { icon:'person',   label:'My Profile' },
                      { icon:'settings', label:'Settings'   },
                      { icon:'logout',   label:'Sign Out'   },
                    ].map(item => (
                      <button key={item.label}
                              onClick={() => { setDropOpen(false); if (item.label==='Sign Out') window.location.href='/auth'; }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-[#334155]
                                         hover:bg-surface-bright transition-colors text-left">
                        <Icon name={item.icon} className="text-[18px] text-on-surface-variant" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN ──────────────────────────────────────────────────────────── */}
      <main className="mt-20 py-12 px-6 max-w-[1100px] mx-auto min-h-screen">

        {/* ── GREETING ──────────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-headline-section text-headline-section text-primary mb-2">
                Good morning, Kofi 👋
              </h1>
              <p className="text-on-surface-variant font-body-lg text-body-lg">
                You have 2 assessments scheduled for today. Best of luck!
              </p>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-5 py-3 rounded-full shadow-sm border border-outline-variant/30 flex items-center gap-3">
                <Icon name="description" className="text-[#2563EB] text-[20px]" />
                <span className="font-semibold text-primary text-[14px]">4 Upcoming</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-full shadow-sm border border-outline-variant/30 flex items-center gap-3">
                <Icon name="check_circle" className="text-emerald-600 text-[20px]" />
                <span className="font-semibold text-primary text-[14px]">7 Completed</span>
              </div>
              <div className="bg-white px-5 py-3 rounded-full shadow-sm border border-outline-variant/30 ring-2 ring-[#2563EB]/10 flex items-center gap-3">
                <Icon name="schedule" className="text-amber-500 text-[20px]" />
                <span className="font-semibold text-primary text-[14px]">2 Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER ROW ────────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between
                          border-b border-outline-variant/30 pb-1">
            <h2 className="font-headline-md text-headline-md text-primary mb-4 sm:mb-0">Your Exams</h2>
            <div className="flex gap-8">
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setFilter(tab.key)}
                        className={`relative py-3 font-semibold text-[14px] transition-all duration-200
                          ${filter === tab.key
                            ? 'text-[#2563EB] border-b-2 border-[#2563EB] -mb-px'
                            : 'text-on-surface-variant hover:text-[#2563EB]'
                          }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXAM CARDS ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {filtered.length === 0
            ? <EmptyState />
            : filtered.map(exam => (
                <div key={exam.id}
                     className="transition-all duration-300 animate-[fadeSlideUp_0.3s_ease_both]">
                  <ExamCard exam={exam} onEnter={setModalExam} />
                </div>
              ))
          }
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-surface-container-highest/30 border-t border-outline-variant/30 py-12">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="visibility" className="text-white text-[16px]" />
            </div>
            <span className="font-bold text-primary">Observerr</span>
          </div>
          <p className="text-on-surface-variant text-[13px]">© 2025 Observerr Academic Integrity Platform. All rights reserved.</p>
          <div className="flex gap-6 text-[13px] font-medium text-on-surface-variant">
            {['Privacy Policy','Terms of Service','Contact Support'].map(l => (
              <a key={l} href="#" className="hover:text-[#2563EB] transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── PRE-EXAM MODAL ────────────────────────────────────────────────── */}
      {modalExam && <PreExamModal exam={modalExam} onClose={() => setModalExam(null)} />}
    </div>
  );
};

export default StudentDashboard;
