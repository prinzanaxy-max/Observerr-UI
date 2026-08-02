import { memo } from 'react';
import Icon from '../student/Icon';

type StudentReportActionsProps = {
  studentName: string;
};

const StudentReportActions = memo(({ studentName }: StudentReportActionsProps) => (
  <div className="bg-gradient-to-br from-student-surface to-student-surface-container-low rounded-[24px] p-4 sm:p-6 lecturer-card-elevation border border-student-surface-container-high">
    <h3 className="text-student-headline-sm font-student text-student-on-surface mb-2">Detailed Report</h3>
    <p className="text-student-body-md font-student text-student-on-surface-variant mb-6">
      Review the incident timeline for {studentName}. Export and manual-review workflows require backend support.
    </p>
    <button
      type="button"
      disabled
      title="Report export is not available from the backend yet"
      className="w-full py-4 rounded-xl bg-student-surface-container-high text-student-on-surface-variant font-student font-bold text-student-body-lg flex justify-center items-center gap-2 cursor-not-allowed opacity-70"
    >
      <Icon name="download" />
      Download Report
    </button>
    <button
      type="button"
      disabled
      title="Manual review requests are not available from the backend yet"
      className="w-full mt-3 py-3 rounded-xl border-2 border-student-outline-variant text-student-on-surface-variant font-student font-bold text-student-body-md flex justify-center items-center gap-2 cursor-not-allowed opacity-70"
    >
      Request Manual Review
    </button>
  </div>
));

StudentReportActions.displayName = 'StudentReportActions';

export default StudentReportActions;
