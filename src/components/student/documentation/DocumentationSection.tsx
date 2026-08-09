import { memo } from 'react';
import Icon from '../Icon';
import type { DocSection } from '../../../data/studentDocumentationData';

type DocumentationSectionProps = {
  section: DocSection;
};

const DocumentationSection = memo(({ section }: DocumentationSectionProps) => (
  <section id={section.id} className="scroll-mt-28">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-student-primary-container/20 flex items-center justify-center text-student-primary shrink-0">
        <Icon name={section.icon} />
      </div>
      <h2 className="text-student-headline-sm font-student text-student-on-surface">{section.title}</h2>
    </div>

    <div className="space-y-4 pl-0 sm:pl-[52px]">
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="text-student-body-md font-student text-student-on-surface-variant leading-relaxed">
          {paragraph}
        </p>
      ))}

      {section.bullets && (
        <ul className="space-y-2">
          {section.bullets.map((bullet) => (
            <li key={bullet.slice(0, 40)} className="flex items-start gap-3">
              <Icon name="check_circle" className="text-student-tertiary text-[18px] shrink-0 mt-0.5" />
              <span className="text-student-body-md font-student text-student-on-surface-variant">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </section>
));

DocumentationSection.displayName = 'DocumentationSection';

export default DocumentationSection;
