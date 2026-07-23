import { memo } from 'react';
import Icon from '../student/Icon';

type StudentReportActionsProps = {
  studentName: string;
};

const StudentReportActions = memo(({ studentName }: StudentReportActionsProps) => (
  <div className="bg-gradient-to-br from-student-surface to-student-surface-container-low rounded-[24px] p-4 sm:p-6 lecturer-card-elevation border border-student-surface-container-high">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-2">Detailed Report</h3>
    <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
      Download the full incident log for {studentName}, including high-resolution video snippets and audio transcripts.
    </p>
    <button
      type="button"
      className="w-full py-4 rounded-xl bg-gradient-to-r from-student-primary to-student-primary-container text-student-on-primary font-student font-bold text-student-body-lg flex justify-center items-center gap-2 hover:shadow-[0_0_15px_rgba(43,108,0,0.4)] transition-all"
    >
      <Icon name="download" />
      Download Report
    </button>
    <button
      type="button"
      className="w-full mt-3 py-3 rounded-xl border-2 border-student-primary text-student-primary font-student font-bold text-student-body-md flex justify-center items-center gap-2 hover:bg-student-primary-container/10 transition-all"
    >
      Request Manual Review
    </button>
  </div>
));

StudentReportActions.displayName = 'StudentReportActions';

export default StudentReportActions;
