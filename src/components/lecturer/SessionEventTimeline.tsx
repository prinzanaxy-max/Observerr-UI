import { memo, useMemo, useState } from 'react';
import Icon from '../student/Icon';
import type { TimelineEventView } from '../../lib/lecturerStudentsUtils';
import {
  severityCardClass,
  severityDotClass,
  severityIcon,
  severityIconClass,
  severityTitleClass,
} from '../../lib/lecturerStudentsUtils';

type SessionEventTimelineProps = {
  events: TimelineEventView[];
  searchQuery: string;
  loading?: boolean;
};

type EventFilter =
  | 'all'
  | 'tab'
  | 'clipboard'
  | 'face'
  | 'fullscreen'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral';

const FILTER_OPTIONS: { value: EventFilter; label: string }[] = [
  { value: 'all', label: 'Filter: All Events' },
  { value: 'tab', label: 'Tab Switch' },
  { value: 'clipboard', label: 'Copy/Paste' },
  { value: 'face', label: 'Face Detection' },
  { value: 'fullscreen', label: 'Fullscreen / DevTools' },
  { value: 'danger', label: 'Critical' },
  { value: 'warning', label: 'Warnings' },
  { value: 'success', label: 'Success' },
  { value: 'neutral', label: 'Neutral' },
];

const matchesEventTypeFilter = (event: TimelineEventView, filter: EventFilter): boolean => {
  const code = `${event.eventType ?? ''} ${event.title}`.toLowerCase();
  switch (filter) {
    case 'tab':
      return /tab|focus_loss|blur/.test(code);
    case 'clipboard':
      return /clipboard|copy|paste/.test(code);
    case 'face':
      return /face|gaze|multi_face/.test(code);
    case 'fullscreen':
      return /fullscreen|devtools/.test(code);
    case 'danger':
      return event.severity === 'DANGER';
    case 'warning':
      return event.severity === 'WARNING';
    case 'success':
      return event.severity === 'SUCCESS';
    case 'neutral':
      return event.severity === 'NEUTRAL';
    default:
      return true;
  }
};

const SessionEventTimeline = memo(({ events, searchQuery, loading = false }: SessionEventTimelineProps) => {
  const [filter, setFilter] = useState<EventFilter>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return events.filter((event) => {
      if (!matchesEventTypeFilter(event, filter)) return false;
      if (!q) return true;
      return (
        event.title.toLowerCase().includes(q) ||
        event.message.toLowerCase().includes(q) ||
        event.time.toLowerCase().includes(q) ||
        (event.eventType ?? '').toLowerCase().includes(q)
      );
    });
  }, [events, filter, searchQuery]);

  if (loading) {
    return (
      <div className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation xl:col-span-2 animate-pulse">
        <div className="h-8 w-48 bg-student-surface-container-high rounded mb-8" />
        <div className="space-y-6 pl-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-student-surface-container-high rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-student-surface rounded-[24px] p-4 sm:p-6 lecturer-card-elevation relative overflow-hidden xl:col-span-2">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-student-error-container/30 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 relative z-10">
        <h3 className="text-student-headline-sm font-student text-student-on-surface">Session Event Timeline</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as EventFilter)}
          className="px-3 py-1 bg-student-surface-container rounded-full text-student-label-md font-student text-student-on-surface-variant border-0 focus:ring-2 focus:ring-student-primary/30 cursor-pointer"
          aria-label="Filter events"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="relative z-10 pl-4 border-l-2 border-student-surface-container-high space-y-8">
        {filtered.map((event) => (
          <div key={event.id} className="relative">
            <div
              className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full ring-4 ring-student-surface ${severityDotClass[event.severity]} ${
                event.severity === 'DANGER' ? 'animate-pulse' : ''
              }`}
            />
            <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
              <span className={`text-student-label-md font-student ${severityTitleClass[event.severity]}`}>
                {event.time} • {event.title}
              </span>
              {event.points !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-student-label-md font-student font-bold ${
                  event.severity === 'DANGER'
                    ? 'bg-student-error text-student-on-error'
                    : 'bg-student-secondary-container text-student-on-secondary-container'
                }`}>
                  -{event.points} pts
                </span>
              )}
            </div>
            <div className={`p-4 rounded-xl border ${severityCardClass[event.severity]}`}>
              <p className="text-student-body-md font-student text-student-on-surface flex items-start gap-2">
                <Icon
                  name={severityIcon(event.eventType ?? event.title, event.severity)}
                  className={`shrink-0 mt-0.5 ${severityIconClass[event.severity]}`}
                />
                <span>{event.message}</span>
              </p>
              {event.hasSnapshot && (
                <div className="mt-3 flex gap-2">
                  <div className="w-32 h-20 rounded-lg border border-student-error/20 bg-student-surface-container-high flex flex-col items-center justify-center text-student-on-surface-variant text-xs font-student text-center px-2 gap-1">
                    <Icon name="photo_camera" className="text-[18px]" />
                    Snapshot captured
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
