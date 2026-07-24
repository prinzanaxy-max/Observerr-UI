import { memo, useCallback, useState } from 'react';
import Icon from '../Icon';
import { SUPPORT_FAQ } from '../../../data/studentSettingsData';

const SupportPanel = memo(() => {
  const [openId, setOpenId] = useState<number | null>(SUPPORT_FAQ[0]?.id ?? null);

  const toggleFaq = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-student-headline-sm font-student text-student-on-surface mb-1">Get Help</h3>
          <p className="text-student-body-md font-student text-student-on-surface-variant">
            Contact support or browse common questions about exams and integrity monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <a
            href="mailto:support@observerr.app"
            className="flex items-center gap-3 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest hover:border-student-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0">
              <Icon name="mail" />
            </div>
            <div>
              <p className="text-student-body-lg font-student font-medium text-student-on-surface">Email Support</p>
              <p className="text-student-body-md font-student text-student-on-surface-variant">support@observerr.app</p>
            </div>
          </a>

          <a
            href="https://docs.observerr.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border border-student-outline-variant/30 bg-student-surface-container-lowest hover:border-student-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0">
              <Icon name="menu_book" />
            </div>
            <div>
              <p className="text-student-body-lg font-student font-medium text-student-on-surface">Documentation</p>
              <p className="text-student-body-md font-student text-student-on-surface-variant">Student setup guides</p>
            </div>
          </a>
        </div>
      </section>

      <section className="student-exam-glass-card rounded-[24px] p-6 sm:p-8">
        <h3 className="text-student-headline-sm font-student text-student-on-surface mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2 max-w-2xl">
          {SUPPORT_FAQ.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="rounded-xl border border-student-outline-variant/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left bg-student-surface-container-lowest hover:bg-student-surface-container-low transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-student-body-lg font-student font-medium text-student-on-surface">{item.question}</span>
                  <Icon name={isOpen ? 'expand_less' : 'expand_more'} className="shrink-0 text-student-on-surface-variant" />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 bg-student-surface-container-lowest">
                    <p className="text-student-body-md font-student text-student-on-surface-variant">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
});

SupportPanel.displayName = 'SupportPanel';

export default SupportPanel;
