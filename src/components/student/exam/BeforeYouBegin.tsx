import { memo } from 'react';

type BeforeYouBeginProps = {
  instructions: string[];
};

const BeforeYouBegin = memo(({ instructions }: BeforeYouBeginProps) => (
  <div className="px-2">
    <h4 className="text-student-headline-sm font-student text-student-on-surface mb-4">Before you begin</h4>
    <ul className="space-y-3 text-student-body-md font-student text-student-on-surface-variant">
      {instructions.map((item) => (
        <li key={item} className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-student-outline shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  </div>
));

BeforeYouBegin.displayName = 'BeforeYouBegin';

export default BeforeYouBegin;
