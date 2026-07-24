import { memo } from 'react';
import Icon from '../Icon';
import type { TimelineEvent } from '../../../data/studentResultDetailData';

type SessionTimelineProps = {
  events: TimelineEvent[];
};

const dotForType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-6 h-6 rounded-full bg-student-primary-container border-4 border-student-surface flex-shrink-0 mt-1 relative z-10 shadow-sm flex items-center justify-center">
          <Icon name="check" filled className="text-[14px] text-student-on-primary-container" />
        </div>
      );
    case 'shield':
      return (
        <div className="w-6 h-6 rounded-full bg-student-primary-container border-4 border-student-surface flex-shrink-0 mt-1 relative z-10 shadow-sm flex items-center justify-center">
          <Icon name="shield" filled className="text-[14px] text-student-on-primary-container" />
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 rounded-full bg-student-surface-container-high border-4 border-student-surface flex-shrink-0 mt-1 relative z-10 shadow-sm" />
      );
  }
};

const SessionTimeline = memo(({ events }: SessionTimelineProps) => (
  <section className="flex-1 w-full flex flex-col gap-6">
    <h2 className="text-student-headline-sm font-student text-student-on-background">Session Timeline</h2>

    <div className="student-exam-glass-card rounded-2xl p-6 sm:p-8 relative">
      <div className="absolute left-11 top-12 bottom-12 w-0.5 bg-student-outline-variant/30" aria-hidden="true" />

      <div className="space-y-8 relative">
        {events.map((event) => (
          <div key={event.id} className="flex gap-6 items-start group">
            {dotForType(event.type)}
            <div className="flex-1 pt-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
                <h3 className="text-student-body-lg font-student font-semibold text-student-on-surface">{event.title}</h3>
                <span className="text-student-label-md font-student text-student-on-surface-variant shrink-0">{event.timeLabel}</span>
              </div>
              <p className="text-student-body-md font-student text-student-on-surface-variant max-w-lg">{event.description}</p>

              {event.imageUrl && (
                <div className="mt-4 flex gap-3">
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-student-outline-variant/50 relative">
                    <img src={event.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                    {event.imageCaption && (
                      <div className="absolute bottom-1 right-1 bg-student-surface/80 backdrop-blur text-[10px] px-1 rounded text-student-on-surface font-student">
                        {event.imageCaption}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {event.aiConfidence && (
                <div className="mt-4 p-4 bg-student-surface-container-lowest rounded-xl border border-student-outline-variant/30 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-student-tertiary-container/50 flex items-center justify-center text-student-on-tertiary-container shrink-0">
                    <Icon name="analytics" />
                  </div>
                  <div>
                    <div className="text-student-label-md font-student text-student-on-surface-variant">{event.aiConfidence.label}</div>
                    <div className="text-student-body-lg font-student font-bold text-student-on-surface">{event.aiConfidence.value}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

SessionTimeline.displayName = 'SessionTimeline';

export default SessionTimeline;
