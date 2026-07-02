import { useEffect } from 'react';

/* ─── Logo Component ─────────────────────────────────────────────────────── */
type LogoProps = {
  shieldColor?: string;
  irisColor?: string;
  pupilColor?: string;
  className?: string;
};

const ObserrLogo = ({
  shieldColor = '#0F172A',
  irisColor = '#2563EB',
  pupilColor = '#0F172A',
  className = '',
}: LogoProps) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Shield outline */}
    <path
      d="M16 2.5L5 7L5 18.5C5 25.2 9.5 29.8 16 31.8C22.5 29.8 27 25.2 27 18.5L27 7Z"
      stroke={shieldColor}
      strokeWidth="1.8"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Eye: almond/ellipse with pointed corners */}
    <path
      d="M9 18C11.5 13.8 20.5 13.8 23 18C20.5 22.2 11.5 22.2 9 18Z"
      stroke={shieldColor}
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Iris */}
    <circle cx="16" cy="18" r="3.2" fill={irisColor} />
    {/* Pupil */}
    <circle cx="16" cy="18" r="1.6" fill={pupilColor} />
    {/* Glint 1 */}
    <circle cx="17.2" cy="16.8" r="0.65" fill="white" />
    {/* Glint 2 */}
    <circle cx="15.2" cy="17.6" r="0.35" fill="white" />
  </svg>
);

/* ─── Bullet Item ─────────────────────────────────────────────────────────── */
const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="text-[#2563EB] font-bold flex-shrink-0 text-base leading-7">→</span>
    <span className="text-[#6B7280] text-base leading-7">{children}</span>
  </li>
);

/* ─── Landing Page ────────────────────────────────────────────────────────── */
const LandingPage = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
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
    anchors.forEach(anchor => anchor.addEventListener('click', handleClick as EventListener));

    // Intersection Observer for Active Nav Highlighting
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const activeId = entry.target.id;
          navLinks.forEach(link => {
            const target = link.getAttribute('data-target');
            link.classList.remove('text-secondary', 'border-secondary');
            link.classList.add('text-on-surface-variant', 'border-transparent');
            if (target === activeId) {
              link.classList.remove('text-on-surface-variant', 'border-transparent');
              link.classList.add('text-secondary', 'border-secondary');
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
    sections.forEach(section => observer.observe(section));

    // Staggered entrance animation delays
    const heroElements = document.querySelectorAll<HTMLElement>('.entrance-stagger');
    heroElements.forEach((el, index) => {
      if (!el.style.animationDelay) {
        el.style.animationDelay = `${index * 0.15}s`;
      }
    });

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleClick as EventListener));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased overflow-x-hidden">

      {/* ── TopNavBar ─────────────────────────────────────────────────────── */}
      <nav
        className="bg-surface/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 shadow-sm transition-all duration-300"
        id="navbar"
      >
        <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
          {/* Brand */}
          <a className="flex items-center gap-2 group" href="#home">
            <ObserrLogo className="h-8 w-8 group-hover:scale-105 transition-transform duration-200" />
            <span className="font-headline-md text-headline-md font-bold text-on-surface">
              Observerr
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            <a className="nav-link border-b-2 pb-1 active:scale-95 transition-all duration-200 text-on-surface-variant border-transparent hover:text-secondary" data-target="home" href="#home">Home</a>
            <a className="nav-link pb-1 border-b-2 active:scale-95 transition-all duration-200 text-on-surface-variant border-transparent hover:text-secondary" data-target="how-it-works" href="#how-it-works">How It Works</a>
            <a className="nav-link pb-1 border-b-2 border-transparent active:scale-95 transition-all duration-200 text-on-surface-variant hover:text-secondary" data-target="for-lecturers" href="#for-lecturers">For Lecturers</a>
            <a className="nav-link pb-1 border-b-2 border-transparent active:scale-95 transition-all duration-200 text-on-surface-variant hover:text-secondary" data-target="for-students" href="#for-students">For Students</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a className="hidden md:block font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors font-medium" href="/auth">Login</a>
            <a className="bg-secondary text-on-primary font-label-sm text-label-sm px-6 py-2.5 rounded-full hover:bg-secondary-container hover:scale-[1.03] transition-all duration-200 font-medium shadow-sm hover:shadow-md" href="/auth?mode=signup">Sign Up</a>
          </div>
        </div>
      </nav>

      <main className="pt-20">

        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <section className="relative pt-section-padding-mobile md:pt-section-padding-desktop pb-16 md:pb-24 overflow-hidden bg-surface" id="home">
          <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-7 z-10 entrance-stagger" style={{ animationDelay: '0s' }}>
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-label-sm text-label-sm mb-6 border border-secondary/20">
                <span className="material-symbols-outlined text-sm">shield</span>
                Exam Integrity Platform
              </div>
              <h1 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero text-on-surface mb-6">
                Honest Exams <br className="hidden md:block" />
                Start With <span className="text-secondary">Observerr.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">
                Empowering institutions with AI-driven proctoring that respects student privacy while maintaining the highest academic standards. No complex plugins, just secure results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a className="bg-secondary text-on-primary font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-secondary-container hover:scale-[1.03] transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2" href="/auth?mode=signup">
                  Get Started Free
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a className="bg-surface-container-highest text-on-surface font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-surface-variant hover:scale-[1.03] transition-all duration-200 font-medium text-center" href="#how-it-works">
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="lg:col-span-5 relative h-[500px] w-full flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <svg className="absolute -right-20 -top-20 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] text-[#2563EB] opacity-100" viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <svg className="absolute -right-40 top-1/4 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] text-[#93C5FD] opacity-70 rotate-45" viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <svg className="absolute -right-10 -bottom-20 w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] text-[#DBEAFE] opacity-40 -rotate-90" viewBox="0 0 100 100">
                  <path d="M 10,50 A 40,40 0 1,1 90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="relative w-full h-full">
                {/* Card 1 */}
                <div className="absolute top-10 left-0 md:-left-12 bg-white p-4 rounded-xl shadow-lg border border-outline-variant/30 entrance-stagger slow-float z-30" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <p className="font-label-sm text-[12px] text-on-surface-variant">Integrity Score</p>
                      <p className="font-body-md text-sm text-on-surface">Kofi Atta — <span className="font-bold text-secondary">94%</span> <span className="text-emerald-500 ml-1">🟢 Low Risk</span></p>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="absolute top-1/2 -right-4 md:-right-8 bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-secondary border-y border-r border-outline-variant/30 entrance-stagger slow-float z-30" style={{ animationDelay: '0.6s' }}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">⚠️</span>
                      <p className="font-headline-md text-sm text-on-surface">Flag Detected</p>
                    </div>
                    <p className="font-body-md text-[13px] text-on-surface-variant">Tab switch — Yaw Darko</p>
                    <div className="flex gap-2 mt-1">
                      <button className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface uppercase tracking-wider">Dismiss</button>
                      <button className="text-[11px] font-bold text-secondary hover:text-secondary-container uppercase tracking-wider">Review</button>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="absolute bottom-10 left-10 md:left-4 bg-white p-4 rounded-xl shadow-lg border border-outline-variant/30 entrance-stagger slow-float z-30" style={{ animationDelay: '0.8s' }}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-tight">Flags This Week</p>
                      <p className="font-headline-md text-2xl text-on-surface">17</p>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      <div className="w-1.5 bg-secondary/20 h-3 rounded-full"></div>
                      <div className="w-1.5 bg-secondary/40 h-5 rounded-full"></div>
                      <div className="w-1.5 bg-secondary/60 h-4 rounded-full"></div>
                      <div className="w-1.5 bg-secondary h-7 rounded-full"></div>
                      <div className="w-1.5 bg-secondary/50 h-5 rounded-full"></div>
                    </div>
                    <span className="text-xl">📊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Band ────────────────────────────────────────────────────── */}
        <section className="bg-surface-bright py-12 border-y border-outline-variant/30" id="stats">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center px-4 entrance-stagger border-r border-outline-variant/30" style={{ animationDelay: '0.1s' }}>
                <p className="font-display-hero-mobile text-display-hero-mobile text-secondary mb-2">99.9%</p>
                <p className="font-body-md text-sm text-on-surface-variant">Uptime Reliability</p>
              </div>
              <div className="text-center px-4 entrance-stagger md:border-r border-outline-variant/30" style={{ animationDelay: '0.2s' }}>
                <p className="font-display-hero-mobile text-display-hero-mobile text-secondary mb-2">500k+</p>
                <p className="font-body-md text-sm text-on-surface-variant">Exams Secured</p>
              </div>
              <div className="text-center px-4 entrance-stagger border-r border-outline-variant/30" style={{ animationDelay: '0.3s' }}>
                <p className="font-display-hero-mobile text-display-hero-mobile text-secondary mb-2">&lt;1s</p>
                <p className="font-body-md text-sm text-on-surface-variant">Detection Latency</p>
              </div>
              <div className="text-center px-4 entrance-stagger" style={{ animationDelay: '0.4s' }}>
                <p className="font-display-hero-mobile text-display-hero-mobile text-secondary mb-2">24/7</p>
                <p className="font-body-md text-sm text-on-surface-variant">Automated Monitoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────────────────── */}
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
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-outline-variant/30 -z-10 translate-y-[-50%]"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border-t-4 border-t-secondary border-x border-b border-outline-variant/20 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute -right-4 -top-8 text-[120px] font-bold text-surface-container-high opacity-50 z-0 select-none group-hover:scale-110 transition-transform">1</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                    <span className="material-symbols-outlined">link</span>
                  </div>
                  <h3 className="font-headline-md text-lg text-on-surface mb-3">Connect Platform</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">Integrate with your existing LMS (Canvas, Moodle, Blackboard) via LTI seamlessly.</p>
                  <a className="text-secondary font-label-sm text-sm hover:underline flex items-center gap-1 w-max" href="#">
                    Integration Docs <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </a>
                </div>
              </div>
              {/* Step 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border-t-4 border-t-secondary border-x border-b border-outline-variant/20 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute -right-4 -top-8 text-[120px] font-bold text-surface-container-high opacity-50 z-0 select-none group-hover:scale-110 transition-transform">2</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <h3 className="font-headline-md text-lg text-on-surface mb-3">Verify Identity</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">Students complete a quick, automated ID verification scan before starting the exam.</p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_10px_25px_-5px_rgba(15,23,42,0.05)] border-t-4 border-t-secondary border-x border-b border-outline-variant/20 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="absolute -right-4 -top-8 text-[120px] font-bold text-surface-container-high opacity-50 z-0 select-none group-hover:scale-110 transition-transform">3</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                    <span className="material-symbols-outlined">monitoring</span>
                  </div>
                  <h3 className="font-headline-md text-lg text-on-surface mb-3">Monitor &amp; Review</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-4">AI algorithms monitor the session, flagging suspicious behavior for lecturer review.</p>
                  <a className="text-secondary font-label-sm text-sm hover:underline flex items-center gap-1 w-max" href="#">
                    Sample Report <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── For Lecturers ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-white" id="for-lecturers">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: Copy */}
              <div>
                <p className="text-[#2563EB] font-bold uppercase text-[13px] tracking-[0.1em] mb-4">FOR LECTURERS</p>
                <h2 className="text-[#0F172A] font-bold text-[36px] leading-[1.2] md:text-[42px] tracking-tight mb-5">
                  Run honest exams at scale.
                </h2>
                <p className="text-[#6B7280] text-[17px] leading-relaxed mb-8">
                  Create exams in minutes, monitor every student session live, and receive a full integrity report the moment the exam closes. No invigilators needed.
                </p>
                <ul className="space-y-4 mb-10">
                  <BulletItem>Build MCQ, essay, or mixed format exams</BulletItem>
                  <BulletItem>Watch live integrity scores update in real time</BulletItem>
                  <BulletItem>Get a timestamped event log per student</BulletItem>
                  <BulletItem>Export PDF reports for your records</BulletItem>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/auth?mode=signup"
                    className="bg-[#2563EB] text-white text-[14px] font-semibold px-8 py-4 rounded-full hover:bg-[#1d4ed8] hover:scale-[1.03] transition-all duration-200 text-center"
                  >
                    Get Started Free
                  </a>
                </div>
              </div>

              {/* Right: Lecturer Dashboard Mockup */}
              <div className="flex justify-center lg:justify-end">
                <div
                  className="bg-white w-full max-w-[460px] rounded-xl overflow-hidden"
                  style={{
                    borderTop: '4px solid #2563EB',
                    boxShadow: '0 20px 60px -10px rgba(15,23,42,0.18)',
                  }}
                >
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div>
                      <p className="text-[#0F172A] font-bold text-[15px]">CSC 301 — Midterm</p>
                      <p className="text-[#6B7280] text-[12px] mt-0.5">42 students enrolled</p>
                    </div>
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                      LIVE
                    </span>
                  </div>

                  {/* Table Header */}
                  <div className="px-6 py-2.5 bg-gray-50 border-b border-gray-100 grid grid-cols-12 gap-2 items-center">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider col-span-4">Student</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider col-span-3">Score</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider col-span-2">Risk</span>
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider col-span-3 text-right">Action</span>
                  </div>

                  {/* Table Rows */}
                  {[
                    { name: 'Kofi Atta',     score: '94%', risk: 'Low',  badge: '🟢', high: false },
                    { name: 'Ama Serwaa',    score: '81%', risk: 'Low',  badge: '🟢', high: false },
                    { name: 'Yaw Darko',     score: '32%', risk: 'High', badge: '🔴', high: true  },
                    { name: 'Efua Boateng',  score: '28%', risk: 'High', badge: '🔴', high: true  },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`px-6 py-3.5 grid grid-cols-12 gap-2 items-center border-b border-gray-50 last:border-0 ${row.high ? 'bg-red-50/40' : ''}`}
                    >
                      <span className="text-[13px] font-medium text-[#0F172A] col-span-4 truncate">{row.name}</span>
                      <span className={`text-[13px] font-bold col-span-3 ${row.high ? 'text-red-600' : 'text-[#0F172A]'}`}>{row.score}</span>
                      <span className="text-[12px] col-span-2 flex items-center gap-1">
                        <span>{row.badge}</span>
                        <span className={`font-medium ${row.high ? 'text-red-600' : 'text-emerald-600'}`}>{row.risk}</span>
                      </span>
                      <div className="col-span-3 flex justify-end">
                        {row.high ? (
                          <button
                            className="text-[11px] font-bold text-red-600 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
                            style={{ boxShadow: '0 0 8px rgba(220,38,38,0.2)' }}
                          >
                            Investigate
                          </button>
                        ) : (
                          <button className="text-[11px] font-bold text-[#2563EB] border border-[#2563EB]/30 px-2.5 py-1 rounded-lg hover:bg-[#2563EB]/5 transition-colors">
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Card Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
                    <a href="#" className="text-[12px] text-[#2563EB] font-medium hover:underline">
                      View all 42 students →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── For Students ──────────────────────────────────────────────────── */}
        <section className="py-20 bg-[#F8F9FA]" id="for-students">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left: Student Dashboard Mockup — stacks below copy on mobile */}
              <div className="flex justify-center lg:justify-start order-2 lg:order-1">
                <div
                  className="bg-white w-full max-w-[420px] rounded-xl overflow-hidden"
                  style={{
                    borderTop: '4px solid #2563EB',
                    boxShadow: '0 20px 60px -10px rgba(15,23,42,0.18)',
                  }}
                >
                  {/* Dashboard Header */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-[#0F172A] font-bold text-[15px]">Good morning, Kofi 👋</p>
                    <span className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] text-xs font-bold">KA</span>
                  </div>

                  <div className="px-6 py-5 space-y-3">
                    {/* Active Exam Card */}
                    <div
                      className="rounded-xl p-4 border border-[#2563EB]/20 bg-[#EFF6FF]"
                    >
                      <p className="text-[#0F172A] font-bold text-[13px] mb-3">CSC 301 — Midterm Examination</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-emerald-700 font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                          Available Now
                        </span>
                        <a
                          href="#"
                          className="bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1.5 rounded-full hover:bg-[#1d4ed8] transition-colors"
                        >
                          Enter Exam →
                        </a>
                      </div>
                    </div>

                    {/* Starting Soon */}
                    <div className="rounded-xl p-4 border border-gray-100 bg-white opacity-80">
                      <div className="flex items-center justify-between">
                        <p className="text-[#0F172A] font-medium text-[13px]">MTH 203 — Quiz 3</p>
                        <span className="text-[12px] text-amber-600 font-semibold flex items-center gap-1">🟡 Starting Soon</span>
                      </div>
                    </div>

                    {/* Upcoming */}
                    <div className="rounded-xl p-4 border border-gray-100 bg-white opacity-50">
                      <div className="flex items-center justify-between">
                        <p className="text-[#0F172A] font-medium text-[13px]">ENG 101 — Final Exam</p>
                        <span className="text-[12px] text-gray-400 font-semibold flex items-center gap-1">⚪ Upcoming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Copy */}
              <div className="order-1 lg:order-2">
                <p className="text-[#2563EB] font-bold uppercase text-[13px] tracking-[0.1em] mb-4">FOR STUDENTS</p>
                <h2 className="text-[#0F172A] font-bold text-[36px] leading-[1.2] md:text-[42px] tracking-tight mb-5">
                  Just show up and focus.
                </h2>
                <p className="text-[#6B7280] text-[17px] leading-relaxed mb-8">
                  No downloads. No extensions. Enter your exam code, answer your questions, and submit. Observerr handles everything else silently.
                </p>
                <ul className="space-y-4 mb-10">
                  <BulletItem>Works in Chrome and Firefox — nothing to install</BulletItem>
                  <BulletItem>Pre-exam checklist walks you through in 60 seconds</BulletItem>
                  <BulletItem>See your integrity score immediately after submission</BulletItem>
                  <BulletItem>Simple dashboard shows all your upcoming exams</BulletItem>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/auth?mode=signup"
                    className="bg-[#2563EB] text-white text-[14px] font-semibold px-8 py-4 rounded-full hover:bg-[#1d4ed8] hover:scale-[1.03] transition-all duration-200 text-center"
                  >
                    Get Started Free
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section className="py-20 bg-secondary text-on-primary">
          <div className="max-w-container-max mx-auto px-gutter text-center">
            <div className="flex justify-center mb-6">
              <ObserrLogo
                className="h-16 w-16"
                shieldColor="white"
                irisColor="rgba(255,255,255,0.35)"
                pupilColor="rgba(255,255,255,0.8)"
              />
            </div>
            <h2 className="font-display-hero-mobile text-display-hero-mobile md:font-display-hero md:text-display-hero mb-6">
              The invigilator that never blinks.
            </h2>
            <p className="font-body-lg text-lg text-secondary-fixed/80 max-w-2xl mx-auto mb-10">
              Join leading institutions maintaining academic integrity without compromising student experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a className="bg-primary-container text-secondary font-label-sm text-label-sm px-8 py-4 rounded-full hover:bg-surface-bright hover:scale-[1.03] transition-all duration-200 font-bold shadow-lg" href="/auth?mode=signup">Start Free Trial</a>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-surface-container-highest w-full py-section-padding-desktop border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-gutter">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <a className="flex items-center gap-2 mb-4" href="#home">
              <ObserrLogo shieldColor="#9CA3AF" irisColor="#D1D5DB" pupilColor="#9CA3AF" className="h-6 w-6 opacity-75" />
              <span className="font-headline-md text-headline-md font-bold text-on-surface">Observerr</span>
            </a>
            <p className="font-body-md text-sm text-on-surface-variant mb-6">© 2024 Observerr Academic Integrity Platform. All rights reserved.</p>
          </div>
          {/* Links Column 1 */}
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Product</p>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">For Lecturers</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">For Students</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Integrations</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Pricing</a>
          </div>
          {/* Links Column 2 */}
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Company</p>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">About Us</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Integrity Manifesto</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Careers</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Contact Support</a>
          </div>
          {/* Links Column 3 */}
          <div className="col-span-1 flex flex-col gap-3">
            <p className="font-label-sm font-bold text-on-surface mb-2">Legal</p>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Privacy Policy</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Terms of Service</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Security</a>
            <a className="font-body-md text-sm text-on-surface-variant hover:text-on-surface hover:underline transition-all" href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
