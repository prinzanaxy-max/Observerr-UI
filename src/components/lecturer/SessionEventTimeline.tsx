import { memo, useMemo, useState } from 'react';
import Icon from '../student/Icon';
import type { TimelineEvent } from '../../data/studentTimelineData';
import {
  eventCardClass,
  eventDotClass,
  eventTitleClass,
  pointsBadgeClass,
} from '../../data/studentTimelineData';

type SessionEventTimelineProps = {
  events: TimelineEvent[];
  searchQuery: string;
};

const SessionEventTimeline = memo(({ events, searchQuery }: SessionEventTimelineProps) => {
  const [filter, setFilter] = useState<'all' | TimelineEvent['type']>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      if (filter !== 'all' && event.type !== filter) return false;
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.message.toLowerCase().includes(q) ||
        event.time.toLowerCase().includes(q)
      );
    });
  }, [events, filter, searchQuery]);

  return (
    <div className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation relative overflow-hidden xl:col-span-2">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-student-error-container/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 relative z-10">
        <h3 className="text-student-headline-sm font-student text-student-on-surface">Session Event Timeline</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-3 py-1 bg-student-surface-container rounded-full text-student-label-md font-student text-student-on-surface-variant border-0 focus:ring-2 focus:ring-student-primary/30 cursor-pointer"
          aria-label="Filter events"
        >
          <option value="all">Filter: All Events</option>
          <option value="start">Session Start</option>
          <option value="minor">Minor Infractions</option>
          <option value="critical">Critical Violations</option>
          <option value="end">Session End</option>
        </select>
      </div>

      <div className="relative z-10 pl-4 border-l-2 border-student-surface-container-high space-y-8">
        {filtered.map((event) => (
          <div key={event.id} className="relative">
            <div
              className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full ring-4 ring-student-surface ${eventDotClass[event.type]} ${
                event.pulse ? 'animate-pulse' : ''
              }`}
            />
            <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
              <span className={`text-student-label-md font-student ${eventTitleClass[event.type]}`}>
                {event.time} • {event.title}
              </span>
              {event.points !== undefined && (event.type === 'minor' || event.type === 'critical') && (
                <span className={`px-2 py-0.5 rounded-full text-student-label-md font-student font-bold ${pointsBadgeClass[event.type]}`}>
                  -{event.points} pts
                </span>
              )}
            </div>
            <div className={`p-4 rounded-xl border ${eventCardClass[event.type]}`}>
              <p className="text-student-body-md font-student text-student-on-surface flex items-start gap-2">
                <Icon
                  name={event.icon}
                  className={`shrink-0 mt-0.5 ${
                    event.type === 'critical'
                      ? 'text-student-error'
                      : event.type === 'minor'
                        ? 'text-student-on-secondary-container'
                        : event.type === 'start'
                          ? 'text-student-primary'
                          : 'text-student-on-surface-variant'
                  }`}
                />
                <span>{event.message}</span>
              </p>
              {event.evidenceLabel && (
                <div className="mt-3 flex gap-2">
                  <div className="w-32 h-20 rounded-lg border border-student-error/20 bg-student-surface-container-high flex items-center justify-center text-student-on-surface-variant text-xs font-student text-center px-2">
                    {event.evidenceLabel}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-student-on-surface-variant font-student py-8 text-center">No events match your filter.</p>
        )}
      </div>
    </div>
  );
});

SessionEventTimeline.displayName = 'SessionEventTimeline';

export default SessionEventTimeline;
