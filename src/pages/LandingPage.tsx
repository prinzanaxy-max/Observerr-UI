import { useEffect } from 'react';
import ObserverrLogo from '../components/ObserverrLogo';

const GREEN = {
  text: 'text-[#2b6c00]',
  textHover: 'hover:text-[#276400]',
  bg: 'bg-[#2b6c00]',
  bgHover: 'hover:bg-[#276400]',
  bgLight: 'bg-[#2b6c00]/10',
  border: 'border-[#2b6c00]',
  borderLight: 'border-[#2b6c00]/20',
  borderTop: 'border-t-[#2b6c00]',
  borderLeft: 'border-l-[#2b6c00]',
};

const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className={`${GREEN.text} font-bold flex-shrink-0 text-base leading-7`}>→</span>
    <span className="text-on-surface-variant text-base leading-7">{children}</span>
  </li>
);

const LandingPage = () => {
  useEffect(() => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
    const handleClick = function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId!);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };
    anchors.forEach((anchor) => anchor.addEventListener('click', handleClick as EventListener));

    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          navLinks.forEach((link) => {
            const target = link.getAttribute('data-target');
            link.classList.remove('landing-nav-active', 'text-[#2b6c00]', 'border-[#2b6c00]');
            link.classList.add('text-on-surface-variant', 'border-transparent');
            if (target === activeId) {
              link.classList.remove('text-on-surface-variant', 'border-transparent');
              link.classList.add('landing-nav-active', 'text-[#2b6c00]', 'border-[#2b6c00]');
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0,
    });
    sections.forEach((section) => observer.observe(section));

    const heroElements = document.querySelectorAll<HTMLElement>('.entrance-stagger');
    heroElements.forEach((el, index) => {
      if (!el.style.animationDelay) {
        el.style.animationDelay = `${index * 0.15}s`;
      }
    });

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener('click', handleClick as EventListener));
      observer.disconnect();
    };
  }, []);

  const btnPrimary = `landing-btn-primary inline-flex items-center justify-center font-label-sm text-label-sm px-8 py-4 rounded-full hover:scale-[1.03] transition-all duration-200 font-medium`;
  const btnPrimarySm = `landing-btn-primary inline-flex items-center justify-center font-label-sm text-label-sm px-6 py-2.5 rounded-full hover:scale-[1.03] transition-all duration-200 font-medium shadow-sm`;

  return (
    <div className="landing-page bg-surface font-body-md text-on-surface antialiased overflow-x-hidden">

      <nav
        className="bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm transition-all duration-300"
        id="navbar"
      >
        <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
          <a className="flex items-center gap-2 group" href="#home">
            <ObserverrLogo className="h-8 w-8 group-hover:scale-105 transition-transform duration-200" />
            <span className={`font-headline-md text-headline-md font-bold ${GREEN.text}`}>
              Observerr
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            <a className={`nav-link border-b-2 pb-1 active:scale-95 transition-all duration-200 text-on-surface-variant border-transparent ${GREEN.textHover}`} data-target="home" href="#home">Home</a>
            <a className={`nav-link pb-1 border-b-2 active:scale-95 transition-all duration-200 text-on-surface-variant border-transparent ${GREEN.textHover}`} data-target="how-it-works" href="#how-it-works">How It Works</a>
            <a className={`nav-link pb-1 border-b-2 border-transparent active:scale-95 transition-all duration-200 text-on-surface-variant ${GREEN.textHover}`} data-target="for-lecturers" href="#for-lecturers">For Lecturers</a>
            <a className={`nav-link pb-1 border-b-2 border-transparent active:scale-95 transition-all duration-200 text-on-surface-variant ${GREEN.textHover}`} data-target="for-students" href="#for-students">For Students</a>
          </div>

          <div className="flex items-center gap-4">
            <a className={`hidden md:block font-label-sm text-label-sm text-on-surface-variant ${GREEN.textHover} transition-colors font-medium`} href="/auth">Login</a>
            <a className={btnPrimarySm} href="/auth?mode=signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <main className="pt-20">

        <section className="relative pt-section-padding-mobile md:pt-section-padding-desktop pb-16 md:pb-24 overflow-hidden bg-surface" id="home">
          <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10 entrance-stagger" style={{ animationDelay: '0s' }}>
              <div className={`inline-flex items-center gap-2 ${GREEN.bgLight} ${GREEN.text} px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6 border ${GREEN.borderLight}`}>
                <span className="material-symbols-outlined text-sm">shield</span>
                Exam Integrity Platform
              </div>
              <h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-on-surface mb-6">
                Honest Exams <br className="hidden md:block" />
                Start With <span className={GREEN.text}>Observerr.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
                Empowering institutions with AI-driven proctoring that respects student privacy while maintaining the highest academic standards. No complex plugins, just secure results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a className={`${btnPrimary} shadow-lg hover:shadow-xl gap-2`} href="/auth?mode=signup">
                  Get Started Free
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-surface-variant hover:scale-[1.03] transition-all duration-200 font-medium text-center" href="#how-it-works">
                  See How It Works
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-[500px] w-full flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <svg className={`absolute -right-20 -top-20 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] ${GREEN.text} opacity-100`} viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <svg className="absolute -right-40 top-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] text-[#85dc57] opacity-70 rotate-45" viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <svg className="absolute -right-10 -bottom-20 w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] text-[#d3e9c7] opacity-40 -rotate-90" viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="relative w-full h-full">
                <div className="absolute top-10 left-0 md:-left-12 bg-white p-4 rounded-xl shadow-lg border border-outline-variant/30 entrance-stagger slow-float z-30" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="font-label-sm text-[12px] text-on-surface-variant">Integrity Score</p>
                      <p className="font-body-md text-sm text-on-surface">Kofi Atta — <span className={`font-bold ${GREEN.text}`}>94%</span> <span className="text-emerald-500 ml-1">🟢 Low Risk</span></p>
                    </div>
                  </div>
                </div>
                <div className={`absolute top-1/2 -right-4 md:-right-8 bg-white p-4 rounded-xl shadow-lg ${GREEN.borderLeft} border-y border-r border-outline-variant/30 entrance-stagger slow-float z-30`} style={{ animationDelay: '0.6s' }}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">⚠️</span>
                      <p className="font-headline-md text-sm text-on-surface">Flag Detected</p>
                    </div>
                    <p className="font-body-md text-[13px] text-on-surface-variant">Tab switch — Yaw Darko</p>
                    <div className="flex gap-2 mt-1">
                      <button type="button" className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-wider">Dismiss</button>
                      <button type="button" className={`text-[11px] font-bold ${GREEN.text} hover:text-[#276400] uppercase tracking-wider`}>Review</button>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-10 left-10 md:left-4 bg-white p-4 rounded-xl shadow-lg border border-outline-variant/30 entrance-stagger slow-float z-30" style={{ animationDelay: '0.8s' }}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-tight">Flags This Week</p>
                      <p className="font-headline-md text-2xl text-on-surface">17</p>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      <div className="w-1.5 bg-[#2b6c00]/20 h-3 rounded-full" />
                      <div className="w-1.5 bg-[#2b6c00]/40 h-5 rounded-full" />
                      <div className="w-1.5 bg-[#2b6c00]/60 h-4 rounded-full" />
                      <div className={`w-1.5 ${GREEN.bg} h-7 rounded-full`} />
                      <div className="w-1.5 bg-[#2b6c00]/50 h-5 rounded-full" />
                    </div>
                    <span className="text-xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-bright py-12 border-y border-outline-variant/30" id="stats">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['99.9%', '500k+', '<1s', '24/7'].map((stat, i) => (
                <div key={stat} className={`text-center px-4 entrance-stagger ${i < 3 ? 'border-r border-outline-variant/30' : ''}`} style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                  <p className={`font-display-hero-mobile text-display-hero-mobile ${GREEN.text} mb-2`}>{stat}</p>
                  <p className="font-body-md text-sm text-on-surface-variant">
                    {['Uptime Reliability', 'Exams Secured', 'Detection Latency', 'Automated Monitoring'][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-section-padding-mobile md:py-section-padding-desktop bg-surface" id="how-it-works">
          <div className="max-w-container-max mx-auto px-gutter text-center mb-16">
            <h2 className="font-headline-section-mobile text-headline-section-mobile md:font-headline-section md:text-headline-section text-on-surface mb-4">
              Seamless Integration. Rigorous Security.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Getting started is completely frictionless for both institutions and examinees.
            </p>
          </div>
          <div className="max-w-container-max mx-auto px-gutter relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-outline-variant/30 -z-10 translate-y-[-50%]" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '1', icon: 'link', title: 'Connect Platform', desc: 'Integrate with your existing LMS (Canvas, Moodle, Blackboard) via LTI seamlessly.', link: 'Integration Docs' },
                { n: '2', icon: 'verified_user', title: 'Verify Identity', desc: 'Students complete a quick, automated ID verification scan before starting the exam.' },
                { n: '3', icon: 'monitoring', title: 'Monitor & Review', desc: 'AI algorithms monitor the session, flagging suspicious behavior for lecturer review.', link: 'Sample Report' },
              ].map((step) => (
                <div key={step.n} className={`bg-white p-8 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] ${GREEN.borderTop} border-x border-b border-outline-variant/20 relative overflow-hidden group hover:shadow-lg transition-shadow`}>
                  <div className="absolute -right-4 -top-8 text-[120px] font-bold text-surface-container-high opacity-50 z-0 select-none group-hover:scale-110 transition-transform">{step.n}</div>
                  <div className="relative z-10">
                    <div className={`w-12 h-12 ${GREEN.bgLight} rounded-xl flex items-center justify-center ${GREEN.text} mb-6`}>
                      <span className="material-symbols-outlined">{step.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-lg text-on-surface mb-3">{step.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mb-4">{step.desc}</p>
                    {step.link && (
                      <a className={`${GREEN.text} font-label-sm text-sm hover:underline flex items-center gap-1 w-max`} href="#">
                        {step.link} <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white" id="for-lecturers">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className={`${GREEN.text} font-bold uppercase text-[13px] tracking-[0.1em] mb-4`}>FOR LECTURERS</p>
                <h2 className="text-on-surface font-bold text-[36px] leading-[1.2] md:text-[42px] tracking-tight mb-5">
                  Run honest exams at scale.
                </h2>
                <p className="text-on-surface-variant text-[17px] leading-relaxed mb-8">
                  Create exams in minutes, monitor every student session live, and receive a full integrity report the moment the exam closes. No invigilators needed.
                </p>
                <ul className="space-y-4 mb-10">
                  <BulletItem>Build MCQ, essay, or mixed format exams</BulletItem>
                  <BulletItem>Watch live integrity scores update in real time</BulletItem>
                  <BulletItem>Get a timestamped event log per student</BulletItem>
                  <BulletItem>Export PDF reports for your records</BulletItem>
                </ul>
                <a href="/auth?mode=signup" className={`${btnPrimary} text-[14px] px-8`}>
                  Get Started Free
                </a>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className={`bg-white w-full max-w-[460px] rounded-xl overflow-hidden ${GREEN.borderTop}`} style={{ boxShadow: '0 20px 60px -10px rgba(43,108,0,0.12)' }}>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div>
                      <p className="text-on-surface font-bold text-[15px]">CSC 301 — Midterm</p>
                      <p className="text-on-surface-variant text-[12px] mt-0.5">42 students enrolled</p>
                    </div>
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-2 items-center">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider col-span-4">Student</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider col-span-3">Score</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider col-span-2">Risk</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider col-span-3 text-right">Action</span>
                  </div>
                  {[
                    { name: 'Kofi Atta', score: '94%', risk: 'Low', badge: '🟢', high: false },
                    { name: 'Ama Serwaa', score: '81%', risk: 'Low', badge: '🟢', high: false },
                    { name: 'Yaw Darko', score: '32%', risk: 'High', badge: '🔴', high: true },
                    { name: 'Efua Boateng', score: '28%', risk: 'High', badge: '🔴', high: true },
                  ].map((row) => (
                    <div key={row.name} className={`px-6 py-3.5 grid grid-cols-12 gap-2 items-center border-b border-gray-50 last:border-0 ${row.high ? 'bg-red-50/40' : ''}`}>
                      <span className="text-[13px] font-medium text-on-surface col-span-4 truncate">{row.name}</span>
                      <span className={`text-[13px] font-bold col-span-3 ${row.high ? 'text-red-600' : 'text-on-surface'}`}>{row.score}</span>
                      <span className="text-[12px] col-span-2 flex items-center gap-1">
                        <span>{row.badge}</span>
                        <span className={`font-medium ${row.high ? 'text-red-600' : 'text-emerald-600'}`}>{row.risk}</span>
                      </span>
                      <div className="col-span-3 flex justify-end">
                        {row.high ? (
                          <button type="button" className="text-[11px] font-bold text-red-600 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">Investigate</button>
                        ) : (
                          <button type="button" className={`text-[11px] font-bold ${GREEN.text} border border-[#2b6c00]/30 px-2.5 py-1 rounded-lg hover:bg-[#2b6c00]/5 transition-colors`}>View</button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                    <a href="#" className={`text-[12px] ${GREEN.text} font-medium hover:underline`}>View all 42 students →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-surface-container-low" id="for-students">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <div className={`bg-white w-full max-w-[420px] rounded-xl overflow-hidden ${GREEN.borderTop}`} style={{ boxShadow: '0 20px 60px -10px rgba(43,108,0,0.12)' }}>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-on-surface font-bold text-[15px]">Good morning, Kofi 👋</p>
                    <span className={`w-8 h-8 rounded-full ${GREEN.bgLight} flex items-center justify-center ${GREEN.text} text-xs font-bold`}>KA</span>
                  </div>
                  <div className="px-6 py-5 space-y-3">
                    <div className={`rounded-xl p-4 border ${GREEN.borderLight} ${GREEN.bgLight}`}>
                      <p className="text-on-surface font-bold text-[13px] mb-3">CSC 301 — Midterm Examination</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-emerald-700 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                          Available Now
                        </span>
                        <a href="#" className={`${GREEN.bg} text-white text-[11px] font-bold px-4 py-1.5 rounded-full ${GREEN.bgHover} transition-colors`}>Enter Exam →</a>
                      </div>
                    </div>
                    <div className="rounded-xl p-4 border border-gray-100 bg-white opacity-80">
                      <div className="flex items-center justify-between">
                        <p className="text-on-surface font-medium text-[13px]">MTH 203 — Quiz 3</p>
                        <span className="text-[12px] text-amber-600 font-semibold">🟡 Starting Soon</span>
                      </div>
                    </div>
                    <div className="rounded-xl p-4 border border-gray-100 bg-white opacity-50">
                      <div className="flex items-center justify-between">
                        <p className="text-on-surface font-medium text-[13px]">ENG 101 — Final Exam</p>
                        <span className="text-[12px] text-gray-400 font-semibold">⚪ Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className={`${GREEN.text} font-bold uppercase text-[13px] tracking-[0.1em] mb-4`}>FOR STUDENTS</p>
                <h2 className="text-on-surface font-bold text-[36px] leading-[1.2] md:text-[42px] tracking-tight mb-5">
                  Just show up and focus.
                </h2>
                <p className="text-on-surface-variant text-[17px] leading-relaxed mb-8">
                  No downloads. No extensions. Enter your exam code, answer your questions, and submit. Observerr handles everything else silently.
                </p>
                <ul className="space-y-4 mb-10">
                  <BulletItem>Works in Chrome and Firefox — nothing to install</BulletItem>
                  <BulletItem>Pre-exam checklist walks you through in 60 seconds</BulletItem>
                  <BulletItem>See your integrity score immediately after submission</BulletItem>
                  <BulletItem>Simple dashboard shows all your upcoming exams</BulletItem>
                </ul>
                <a href="/auth?mode=signup" className={`${btnPrimary} text-[14px] px-8`}>
                  Get Started Free
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={`py-20 ${GREEN.bg} text-white`}>
          <div className="max-w-container-max mx-auto px-gutter text-center">
            <div className="flex justify-center mb-6">
              <ObserverrLogo className="h-16 w-16" />
            </div>
            <h2 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero mb-6">
              The invigilator that never blinks.
            </h2>
            <p className="font-body-lg text-lg text-white/80 max-w-2xl mx-auto mb-10">
              Join leading institutions maintaining academic integrity without compromising student experience.
            </p>
            <a className="inline-block bg-[#a0f970] text-[#082100] font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-white hover:scale-[1.03] transition-all duration-200 font-bold shadow-lg" href="/auth?mode=signup">
              Start Free Trial
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-highest w-full py-section-padding-desktop border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-gutter">
          <div className="col-span-1">
            <a className="flex items-center gap-2 mb-4" href="#home">
              <ObserverrLogo className="h-6 w-6 opacity-75" />
              <span className="font-headline-md text-headline-md font-bold text-on-surface">Observerr</span>
            </a>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">© 2024 Observerr Academic Integrity Platform. All rights reserved.</p>
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Product</p>
            {['For Lecturers', 'For Students', 'Integrations', 'Pricing'].map((l) => (
              <a key={l} className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">{l}</a>
            ))}
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Company</p>
            {['About Us', 'Integrity Manifesto', 'Careers', 'Contact Support'].map((l) => (
              <a key={l} className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">{l}</a>
            ))}
          </div>
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Legal</p>
            {['Privacy Policy', 'Terms of Service', 'Security', 'Accessibility'].map((l) => (
              <a key={l} className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
