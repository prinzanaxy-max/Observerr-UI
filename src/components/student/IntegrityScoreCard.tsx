import { memo, useMemo } from 'react';
import Icon from './Icon';
import { INTEGRITY_SCORE } from '../../data/studentDashboardData';

const CIRCLE_RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const IntegrityScoreCard = memo(() => {
  const strokeDashoffset = useMemo(
    () => CIRCUMFERENCE * (1 - INTEGRITY_SCORE / 100),
    [],
  );

  return (
    <div className="student-hero-gradient rounded-[24px] p-6 sm:p-8 text-student-on-primary relative overflow-hidden shadow-[0_10px_30px_rgba(43,108,0,0.15)] flex flex-col sm:flex-row justify-between items-center gap-6">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 space-y-4 max-w-full sm:max-w-[60%]">
        <h2 className="text-student-headline-sm font-student text-student-on-primary/90">Integrity Score</h2>
        <p className="text-student-body-lg font-student text-student-on-primary">Secure and verified account</p>
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full mt-2 border border-white/30">
          <Icon name="verified_user" className="text-[16px] text-student-primary-fixed" />
          <span className="text-student-label-md font-student text-student-primary-fixed tracking-wider">LOW RISK</span>
        </div>
        <p className="text-sm text-student-on-primary/80 mt-2 font-light">
          Your monitoring history shows consistent adherence to testing protocols.
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-center shrink-0">
        <svg className="student-circular-progress w-28 h-28 sm:w-32 sm:h-32" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r={CIRCLE_RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="#a0f970"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-student-display-lg font-student text-white">{INTEGRITY_SCORE}%</span>
        </div>
      </div>
    </div>
  );
});

IntegrityScoreCard.displayName = 'IntegrityScoreCard';

export default IntegrityScoreCard;
