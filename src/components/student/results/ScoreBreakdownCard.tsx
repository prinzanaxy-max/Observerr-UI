import { memo } from 'react';
import Icon from '../Icon';

type ScoreBreakdownCardProps = {
  baseScore: number;
  deductions: number;
  finalScore: number;
  deductionNote?: string;
  onDownload?: () => void;
};

const ScoreBreakdownCard = memo(({
  baseScore,
  deductions,
  finalScore,
  deductionNote,
  onDownload,
}: ScoreBreakdownCardProps) => (
  <div className="student-exam-glass-card rounded-2xl p-6 flex flex-col gap-6">
    <h3 className="text-student-headline-sm font-student text-student-on-background border-b border-student-outline-variant/20 pb-4">
      Score Breakdown
    </h3>

    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-student-body-md font-student text-student-on-surface-variant">Base Score</span>
        <span className="text-student-body-lg font-student font-medium text-student-on-surface">{baseScore}%</span>
      </div>
      <div className="flex justify-between items-center text-student-on-surface-variant">
        <span className="text-student-body-md font-student flex items-center gap-1">
          Deductions
          {deductionNote && (
            <span title={deductionNote} className="cursor-help">
              <Icon name="info" className="text-[16px]" />
            </span>
          )}
        </span>
        <span className="text-student-body-lg font-student font-medium text-student-error">-{deductions}%</span>
      </div>
      <div className="h-px w-full bg-student-outline-variant/30 my-2" />
      <div className="flex justify-between items-center">
        <span className="text-student-body-lg font-student font-bold text-student-on-background">Final Score</span>
        <span className="text-student-headline-md font-student font-bold text-student-primary">{finalScore}%</span>
      </div>
    </div>

    <button
      type="button"
      onClick={onDownload}
      className="w-full mt-2 py-3 px-6 rounded-full bg-gradient-to-r from-student-primary to-student-primary-container text-student-on-primary text-student-body-lg font-student font-bold hover:shadow-[0_0_20px_rgba(140,227,93,0.4)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
    >
      <Icon name="download" />
      Download My Report
    </button>
  </div>
));

ScoreBreakdownCard.displayName = 'ScoreBreakdownCard';

export default ScoreBreakdownCard;
