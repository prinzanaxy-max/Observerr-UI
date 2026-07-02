import { useState, useEffect, useRef } from 'react';

/* ─── Icon helper ─────────────────────────────────────────────────────────── */
const Icon = ({ name, className = '' }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
        aria-hidden="true">{name}</span>
);

/* ─── Data ────────────────────────────────────────────────────────────────── */
const NAV = [
  { icon:'dashboard',  label:'Dashboard',  active:true  },
  { icon:'assignment', label:'My Exams',   active:false },
  { icon:'group',      label:'Students',   active:false },
  { icon:'analytics',  label:'Analytics',  active:false },
  { icon:'settings',   label:'Settings',   active:false },
];

const STUDENTS = [
  { rank:'01', name:'Yaw Darko',    initials:'YD', score:24, risk:'HIGH', flags:14, isHigh:true  },
  { rank:'02', name:'Efua Boateng', initials:'EB', score:42, risk:'HIGH', flags:8,  isHigh:true  },
  { rank:'03', name:'Kofi Ansah',   initials:'KA', score:96, risk:'LOW',  flags:0,  isHigh:false },
];

const FLAGS = [
  { label:'Tab Switch',               count:142, pct:85, color:'#2563EB' },
  { label:'Copy / Paste',             count:68,  pct:45, color:'#2563EB' },
  { label:'Multiple Faces Detected',  count:12,  pct:15, color:'#BA1A1A' },
  { label:'Right-Click Events',       count:34,  pct:30, color:'#2563EB' },
];

const ALERTS = [
  { student:'Efua Boateng', time:'14:22:45', icon:'warning',       tags:[{t:'TAB_SWITCH',  red:true},{t:'3rd Alert',       red:false}] },
  { student:'Yaw Darko',    time:'14:20:12', icon:'content_paste', tags:[{t:'PASTE_ACTION', red:true},{t:'Suspicious Code', red:false}] },
  { student:'Amara Okafor', time:'14:18:55', icon:'visibility_off',tags:[{t:'OFF_SCREEN',  blue:true},{t:'Brief',          red:false}] },
];

const TIMELINE = [
  { time:'14:22:10', title:'Code Paste Detected',   body:"Matched 85% with external repository snippet 'BinaryTree.java'.", code:'public void insert(Node node, int value)...', red:true  },
  { time:'14:15:30', title:'Window Lost Focus',      body:'Inactive for 45 seconds. Multiple tab switches detected.',        code:undefined,                                    red:true  },
  { time:'14:05:00', title:'Session Started',        body:'Environment verification complete. High trust initial state.',    code:undefined,                                    red:false },
];

/* ─── Countdown timer hook ────────────────────────────────────────────────── */
const useTimer = (initial: number) => {
  const [s, setS] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setS(v => v > 0 ? v - 1 : 0), 1000);
    return () => clearInterval(id);
  }, []);
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
};

/* ─── Investigation drawer ────────────────────────────────────────────────── */
const Drawer = ({ student, onClose }: { student: string | null; onClose: () => void }) => (
  <div className={`fixed inset-y-0 right-0 w-[320px] bg-white shadow-2xl border-l border-outline-variant/30
                   transform transition-transform duration-300 ease-in-out z-[100] flex flex-col
                   ${student ? 'translate-x-0' : 'translate-x-full'}`}>
    <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
      <div>
        <h3 className="font-bold text-[16px] text-primary">Investigate: {student}</h3>
        <p className="text-[10px] uppercase font-bold text-error tracking-wider mt-0.5">Critical Integrity Audit</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full transition-all">
        <Icon name="close" className="text-[20px] text-on-surface-variant" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-6">
      <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">Event Timeline</h4>
      <div className="space-y-8 relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-outline-variant/30" />
        {TIMELINE.map((ev, i) => (
          <div key={i} className="relative pl-10">
            <div className={`absolute left-2.5 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10
                             ${ev.red ? 'bg-error' : 'bg-[#2563EB]'}`} />
            <p className="text-[12px] font-bold text-primary">{ev.time} — {ev.title}</p>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{ev.body}</p>
            {ev.code && (
              <div className="mt-2 bg-surface-bright p-2 rounded border border-outline-variant/20 text-[10px] font-mono truncate">
                {ev.code}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="p-4 border-t border-outline-variant/30 bg-surface-bright space-y-3">
      <button className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-bold text-[13px]
                         shadow-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all">
        Download Full Audit Log
      </button>
      <button className="w-full py-3 border border-error text-error rounded-xl font-bold text-[13px]
                         hover:bg-error/5 transition-all">
        Flag Session for Review
      </button>
    </div>
  </div>
);

/* ─── Create exam modal ───────────────────────────────────────────────────── */
const CreateModal = ({ onClose }: { onClose: () => void }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setShow(true)); }, []);
  return (
    <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4
                     transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl
                       transition-all duration-300 ${show ? 'scale-100' : 'scale-95'}`}>
        <div className="p-8 border-b border-outline-variant/30 flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Create New Examination</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full">
            <Icon name="close" className="text-[20px] text-on-surface-variant" />
          </button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{label:'Course Code', placeholder:'e.g. CSC 301'},{label:'Exam Title', placeholder:'e.g. Midterm Session'}].map(f => (
              <div key={f.label} className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider">{f.label}</label>
                <input placeholder={f.placeholder} type="text"
                       className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant
                                  focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none transition-all text-[14px]" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-on-surface-variant tracking-wider">Security Protocol</label>
            <select className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant
                               focus:ring-2 focus:ring-[#2563EB] outline-none transition-all text-[14px]">
              <option>Strict Verification (AI Camera + Browser Lock)</option>
              <option>Standard Monitoring (Browser Events Only)</option>
              <option>Light Check (Periodic Screenshots)</option>
            </select>
          </div>
          <div className="flex items-start gap-3 py-4 px-5 bg-[#2563EB]/5 rounded-2xl border border-[#2563EB]/20">
            <Icon name="info" className="text-[#2563EB] text-[20px] mt-0.5 flex-shrink-0" />
            <p className="text-[12px] font-medium text-[#2563EB] leading-relaxed">
              Advanced plagiarism detection and AI authorship verification will be enabled by default for this session.
            </p>
          </div>
        </div>
        <div className="px-8 py-6 bg-surface-bright border-t border-outline-variant/30 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors text-[14px]">
            Cancel
          </button>
          <button className="px-8 py-3 bg-[#2563EB] text-white rounded-full font-bold text-[14px]
                             shadow-lg hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 transition-all">
            Launch Exam Portal
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  LECTURER DASHBOARD                                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */
const LecturerDashboard = () => {
  const [drawerStudent, setDrawerStudent] = useState<string | null>(null);
  const [createOpen, setCreateOpen]       = useState(false);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [barsReady, setBarsReady]         = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const countdown = useTimer(3600 + 42*60 + 35);

  useEffect(() => { document.title = 'Dashboard — Observerr'; }, []);
  useEffect(() => { const t = setTimeout(() => setBarsReady(true), 600); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="bg-[#F8FAFC] text-on-surface font-body-md min-h-screen overflow-x-hidden">

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-50 flex justify-around
                      items-center h-16 border-t border-outline-variant/30 px-4">
        {[
          { icon:'dashboard',  label:'Home',     active:true  },
          { icon:'assignment', label:'Exams',    active:false },
          { icon:'group',      label:'Students', active:false },
          { icon:'settings',   label:'Settings', active:false },
        ].map(item => (
          <button key={item.label}
                  className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-[#2563EB]' : 'text-on-surface-variant'}`}>
            <Icon name={item.icon} className="text-[22px]" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="flex min-h-screen">

        {/* ── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
        <aside className="hidden md:flex w-[240px] flex-col fixed inset-y-0 left-0
                          bg-white border-r border-outline-variant/30 z-40">
          <div className="p-6">
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Observerr</span>
            <p className="text-[10px] font-semibold text-[#2563EB] uppercase tracking-widest mt-1">Institutional Portal</p>
          </div>

          <nav className="flex-1 mt-2 space-y-1 px-3">
            {NAV.map(item => (
              <a key={item.label} href="#"
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-label-sm text-label-sm
                   ${item.active
                     ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                     : 'text-on-surface-variant hover:bg-surface-bright'
                   }`}>
                <Icon name={item.icon} className="text-[20px]" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* User footer */}
          <div className="p-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-bright cursor-pointer transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#316BF3] flex items-center justify-center text-white font-bold text-[13px]">
                DM
              </div>
              <div>
                <p className="font-semibold text-[13px] text-primary leading-tight">Dr. Mensah</p>
                <p className="text-[11px] text-on-surface-variant">Senior Lecturer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <main className="flex-1 md:ml-[240px] p-4 md:p-8 pb-24 md:pb-8">

          {/* Sticky top header */}
          <header className="sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-30 mb-8 py-4
                             flex flex-col md:flex-row md:items-center justify-between gap-4
                             border-b border-transparent">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Dashboard Overview</h1>
              <p className="text-on-surface-variant font-body-md text-[14px]">Real-time academic integrity monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(o => !o)}
                        className="w-10 h-10 rounded-full bg-white border border-outline-variant/30 flex items-center justify-center hover:bg-surface-bright transition-all relative">
                  <Icon name="notifications" className="text-on-surface-variant text-[20px]" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-2xl border border-outline-variant/30 overflow-hidden z-50">
                    <div className="p-4 bg-surface-bright border-b border-outline-variant/30 flex justify-between items-center">
                      <span className="font-bold text-[13px]">Notifications</span>
                      <button className="text-[11px] text-[#2563EB] font-semibold">Mark all read</button>
                    </div>
                    {[
                      { type:'High Risk Detected', msg:'Efua Boateng triggered "Multiple Tab Switches" in CSC 301.', time:'2 mins ago', red:true },
                      { type:'System Update',      msg:'Proctoring engine updated to v4.2.',                          time:'1 hour ago', red:false },
                    ].map((n,i) => (
                      <div key={i} className="p-4 border-b border-outline-variant/10 hover:bg-surface-bright cursor-pointer transition-colors">
                        <p className={`text-[11px] font-bold ${n.red ? 'text-error' : 'text-primary'}`}>{n.type}</p>
                        <p className="text-[12px] mt-1 text-on-surface">{n.msg}</p>
                        <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create exam button */}
              <button onClick={() => setCreateOpen(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-full
                                 font-label-sm text-label-sm font-semibold hover:bg-[#1D4ED8]
                                 active:scale-95 transition-all shadow-md">
                <Icon name="add" className="text-[20px]" />
                Create New Exam
              </button>
            </div>
          </header>

          {/* ── STAT CARDS ────────────────────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon:'assignment',    label:'Total Exams',         value:'12',  color:'text-[#2563EB]', border:'',              bg:'' },
              { icon:'group',         label:'Students Monitored',  value:'284', color:'text-[#2563EB]', border:'',              bg:'' },
              { icon:'warning',       label:'High Risk Sessions',  value:'16',  color:'text-error',     border:'border-2 border-error', bg:'relative overflow-hidden' },
              { icon:'verified_user', label:'Avg Integrity Score', value:'73%', color:'text-[#2563EB]', border:'',              bg:'' },
            ].map((s,i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border border-outline-variant/30 flex flex-col gap-2 ${s.border} ${s.bg}`}>
                {s.label === 'High Risk Sessions' && (
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full" />
                )}
                <Icon name={s.icon} className={`${s.color} text-[30px]`} />
                <span className={`font-bold text-[11px] uppercase tracking-wider ${s.label === 'High Risk Sessions' ? 'text-error' : 'text-on-surface-variant'}`}>
                  {s.label}
                </span>
                <span className={`text-[32px] font-bold ${s.label === 'High Risk Sessions' ? 'text-error' : 'text-primary'}`}>
                  {s.value}
                </span>
              </div>
            ))}
          </section>

          {/* ── ACTIVE EXAM PANEL ─────────────────────────────────────── */}
          <section className="bg-white rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border border-outline-variant/30 mb-8 overflow-hidden">
            {/* Panel header */}
            <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                  <Icon name="live_tv" className="text-[26px]" />
                </div>
                <div>
                  <h2 className="font-bold text-[18px] text-primary">CSC 301 — Midterm Examination</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700
                                     rounded-full text-[11px] font-bold border border-emerald-200">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      LIVE
                    </span>
                    <span className="text-on-surface-variant text-[12px] flex items-center gap-1">
                      <Icon name="schedule" className="text-[14px]" />
                      Ends in{' '}
                      <span className="font-mono font-bold text-[#2563EB] ml-1">{countdown}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-outline-variant text-on-surface-variant
                                   rounded-xl text-[13px] font-semibold hover:bg-surface-bright transition-all">
                  Export Report
                </button>
                <button className="px-4 py-2 bg-error/10 text-error rounded-xl text-[13px] font-semibold
                                   hover:bg-error hover:text-white transition-all">
                  End Session
                </button>
              </div>
            </div>

            {/* Student table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-bright text-on-surface-variant text-[10px] uppercase tracking-wider font-bold">
                  <tr>
                    {['Rank','Student Name','Integrity Score','Risk Level','Total Flags','Actions'].map((h,i) => (
                      <th key={h} className={`px-6 py-4 ${i===5 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {STUDENTS.map(st => (
                    <tr key={st.name}
                        className={st.isHigh ? 'bg-error/5 border-l-4 border-error' : ''}>
                      <td className="px-6 py-4 text-[13px] font-mono">{st.rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold
                                           ${st.isHigh ? 'bg-error/70' : 'bg-[#2563EB]/70'}`}>
                            {st.initials}
                          </div>
                          <span className="font-semibold text-[14px]">{st.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000"
                                 style={{ width: `${st.score}%`, backgroundColor: st.isHigh ? '#BA1A1A' : '#2563EB' }} />
                          </div>
                          <span className={`text-[11px] font-bold ${st.isHigh ? 'text-error' : 'text-on-surface-variant'}`}>
                            {st.score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-white text-[10px] font-bold uppercase tracking-tight rounded
                                          ${st.isHigh ? 'bg-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {st.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold">{st.flags.toString().padStart(2,'0')}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => setDrawerStudent(st.name)}
                                className="text-on-surface-variant hover:text-[#2563EB] p-2 rounded-xl hover:bg-[#2563EB]/5 transition-all">
                          <Icon name="history" className="text-[20px]" />
                        </button>
                        {st.isHigh ? (
                          <button onClick={() => setDrawerStudent(st.name)}
                                  className="px-3 py-1.5 bg-error text-white rounded-xl text-[11px] font-bold
                                             shadow-sm hover:scale-105 transition-transform">
                            Investigate
                          </button>
                        ) : (
                          <button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant
                                             rounded-xl text-[11px] font-bold hover:bg-surface-bright transition-all">
                            View Logs
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── BOTTOM TWO-COL GRID ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Behavior flags breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border border-outline-variant/30">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-[17px] text-primary">Behavior Flags Breakdown</h3>
                <Icon name="bar_chart" className="text-on-surface-variant text-[22px]" />
              </div>
              <div className="space-y-6">
                {FLAGS.map(f => (
                  <div key={f.label} className="space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-on-surface-variant font-medium">{f.label}</span>
                      <span className="font-bold text-primary">{f.count} instances</span>
                    </div>
                    <div className="w-full h-3 bg-surface-bright rounded-full overflow-hidden border border-outline-variant/10">
                      <div className="h-full rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                           style={{ width: barsReady ? `${f.pct}%` : '0%', backgroundColor: f.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent critical alerts */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border border-outline-variant/30 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[17px] text-primary">Recent Critical Alerts</h3>
                <span className="flex items-center gap-1 text-[10px] bg-error/10 text-error px-2 py-1 rounded font-bold uppercase">
                  <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
                  LIVE FEED
                </span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
                {ALERTS.map((alert,i) => {
                  const isBlue = alert.tags.some(t => (t as { blue?: boolean }).blue);
                  return (
                    <div key={i}
                         className={`flex items-start gap-4 p-3 rounded-xl border-l-4 transition-colors hover:bg-surface-bright cursor-pointer
                                      ${isBlue ? 'border-[#2563EB] bg-[#2563EB]/5' : 'border-error bg-error/5'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                        ${isBlue ? 'bg-[#2563EB]/20 text-[#2563EB]' : 'bg-error/20 text-error'}`}>
                        <Icon name={alert.icon} className="text-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-bold text-[13px] text-primary">{alert.student}</p>
                          <span className="text-[10px] text-on-surface-variant flex-shrink-0">{alert.time}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {alert.tags.map((tag,j) => {
                            const t = tag as { t: string; red?: boolean; blue?: boolean };
                            return (
                              <span key={j} className={`text-[10px] px-2 py-0.5 rounded font-bold
                                ${t.red ? 'bg-error text-white'
                                : t.blue ? 'bg-[#2563EB] text-white'
                                : 'bg-outline-variant text-on-surface-variant'}`}>
                                {t.t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── DRAWER ────────────────────────────────────────────────────────── */}
      <Drawer student={drawerStudent} onClose={() => setDrawerStudent(null)} />
      {/* Backdrop for drawer */}
      {drawerStudent && (
        <div className="fixed inset-0 bg-black/20 z-[99]" onClick={() => setDrawerStudent(null)} />
      )}

      {/* ── CREATE EXAM MODAL ─────────────────────────────────────────────── */}
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
};

export default LecturerDashboard;
