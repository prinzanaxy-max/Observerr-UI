import { memo } from 'react';
import Icon from '../student/Icon';

type CreateExamPageHeaderProps = {
  initials: string;
  onSaveDraft: () => void;
  draftSavedLabel?: string;
};

const CreateExamPageHeader = memo(({ initials, onSaveDraft }: CreateExamPageHeaderProps) => (
  <header className="hidden md:flex shrink-0 justify-between items-center h-16 px-8 bg-student-surface/80 backdrop-blur-md border-b border-student-outline-variant/20 z-20">
    <h1 className="text-student-headline-md font-student font-bold text-student-on-surface">
      Create New Exam
    </h1>

    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={onSaveDraft}
        className="text-student-primary font-student text-student-body-md font-medium hover:text-student-primary-fixed-dim transition-colors"
      >
        Save Draft
      </button>

      <div className="h-6 w-px bg-student-outline-variant/50" aria-hidden="true" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-student-on-surface-variant hover:bg-student-surface-container-high transition-colors"
          aria-label="Notifications"
        >
          <Icon name="notifications" />
        </button>
        <div
          className="w-10 h-10 rounded-full bg-student-primary-container flex items-center justify-center text-student-on-primary-container text-xs font-bold border border-student-outline-variant/30"
          aria-hidden="true"
        >
          {initials}
        </div>
      </div>
    </div>
  </header>
));

CreateExamPageHeader.displayName = 'CreateExamPageHeader';

export default CreateExamPageHeader;
