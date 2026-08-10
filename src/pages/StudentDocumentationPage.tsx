import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StudentPortalLayout from '../components/student/StudentPortalLayout';
import DocumentationSection from '../components/student/documentation/DocumentationSection';
import Icon from '../components/student/Icon';
import {
  DOCUMENTATION_INTRO,
  GMAIL_COMPOSE_URL,
  OBSERVERR_DOCUMENTATION,
  SUPPORT_EMAIL,
} from '../data/studentDocumentationData';

const StudentDocumentationPage = () => {
  const searchQuery = '';
  const [activeSection, setActiveSection] = useState(OBSERVERR_DOCUMENTATION[0]?.id ?? '');

  useEffect(() => {
    document.title = 'Documentation — Observerr';
  }, []);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return OBSERVERR_DOCUMENTATION;
    return OBSERVERR_DOCUMENTATION.filter(
      (section) =>
        section.title.toLowerCase().includes(q) ||
        section.paragraphs.some((p) => p.toLowerCase().includes(q)) ||
        section.bullets?.some((b) => b.toLowerCase().includes(q)),
    );
  }, [searchQuery]);


  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <StudentPortalLayout
      contentClassName="student-settings-bg relative"
    >
      <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-[1000px] mx-auto w-full pb-24 md:pb-12">
        <Link
          to="/student/settings"
          className="inline-flex items-center gap-1 text-student-body-md font-student text-student-on-surface-variant hover:text-student-primary transition-colors mb-6"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Back to Settings
        </Link>

        <header className="student-exam-glass-card rounded-[24px] p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0">
              <Icon name="menu_book" className="text-[24px]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-student-headline-md font-student text-student-on-background font-bold mb-2">
                {DOCUMENTATION_INTRO.title}
              </h1>
              <p className="text-student-body-md font-student text-student-on-surface-variant">
                {DOCUMENTATION_INTRO.subtitle}
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-56 shrink-0 lg:sticky lg:top-24">
            <nav className="student-exam-glass-card rounded-xl p-4 hidden lg:block" aria-label="Documentation sections">
              <p className="text-student-label-md font-student text-student-on-surface-variant uppercase tracking-wider mb-3 px-2">
                On this page
              </p>
              <ul className="flex flex-col gap-1">
                {filteredSections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-student-body-md font-student transition-colors ${
                        activeSection === section.id
                          ? 'bg-student-primary-container/30 text-student-primary font-medium'
                          : 'text-student-on-surface-variant hover:bg-student-surface-container'
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col gap-10">
            {filteredSections.length === 0 ? (
              <div className="text-center py-16 px-6 rounded-2xl student-exam-glass-card">
                <Icon name="search_off" className="text-[48px] text-student-outline mb-4 mx-auto" />
                <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">No topics found</h2>
                <p className="text-student-body-md font-student text-student-on-surface-variant">
                  Try a different search term.
                </p>
              </div>
            ) : (
              filteredSections.map((section) => (
                <DocumentationSection key={section.id} section={section} />
              ))
            )}

            <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8 border border-student-primary-container/30">
              <h2 className="text-student-headline-sm font-student text-student-on-surface mb-2">Still need help?</h2>
              <p className="text-student-body-md font-student text-student-on-surface-variant mb-4">
                Contact our support team via Gmail and we&apos;ll get back to you as soon as possible.
              </p>
              <a
                href={GMAIL_COMPOSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-student-primary text-student-on-primary text-student-body-md font-student font-medium hover:shadow-[0_0_15px_rgba(43,108,0,0.3)] transition-all"
              >
                <Icon name="mail" />
                Email {SUPPORT_EMAIL}
              </a>
            </section>
          </div>
        </div>
      </div>
    </StudentPortalLayout>
  );
};

export default StudentDocumentationPage;
