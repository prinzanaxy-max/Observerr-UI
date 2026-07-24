import { memo } from 'react';
import Icon from '../Icon';

const MonitoringNotice = memo(() => (
  <div className="bg-student-primary text-student-on-primary rounded-[24px] p-6 shadow-lg flex items-start gap-4">
    <Icon name="visibility" filled className="text-[32px] mt-1 shrink-0" />
    <div>
      <h3 className="text-student-headline-sm font-student font-semibold mb-2">Monitoring Notice</h3>
      <p className="text-student-body-md font-student opacity-90 leading-relaxed">
        This exam is monitored by OBSERVERR. Please remain in fullscreen and avoid switching tabs.
        Your camera and microphone must remain active throughout the duration of the examination.
      </p>
    </div>
  </div>
));

MonitoringNotice.displayName = 'MonitoringNotice';

export default MonitoringNotice;
