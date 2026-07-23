import { memo } from 'react';
import Icon from '../student/Icon';
import type { ProctoringFeed } from '../../data/proctoringData';
import { liveStatusTone, riskTone } from '../../data/proctoringData';
import { liveStatusDot } from '../../data/liveMonitoringData';

type ProctoringStudentRailProps = {
  feeds: ProctoringFeed[];
  selectedId: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (feed: ProctoringFeed) => void;
};

const ProctoringStudentRail = memo(({
  feeds,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelect,
}: ProctoringStudentRailProps) => (
  <aside className="bg-student-surface rounded-[24px] lecturer-card-elevation flex flex-col min-h-0 h-full max-h-[calc(100dvh-12rem)] lg:max-h-none">
    <div className="p-4 border-b border-student-surface-variant/50 shrink-0">
      <h3 className="text-student-headline-sm font-student text-student-on-surface mb-3">
        Student Feeds
        <span className="ml-2 text-student-on-surface-variant font-normal text-student-body-md">
          ({feeds.length})
        </span>
      </h3>
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-student-on-surface-variant pointer-events-none" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or ID..."
          className="w-full pl-10 pr-4 py-2 bg-student-surface-container-lowest border border-student-outline-variant rounded-full text-student-body-md font-student focus:outline-none focus:ring-2 focus:ring-student-primary/20 focus:border-student-primary"
          aria-label="Search student feeds"
        />
      </div>
    </div>

    <ul className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2 lecturer-custom-scrollbar" role="listbox" aria-label="Student live feeds">
      {feeds.map((feed) => {
        const isSelected = feed.id === selectedId;
        return (
          <li key={feed.id} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onClick={() => onSelect(feed)}
              className={`w-full text-left rounded-xl overflow-hidden transition-all group ${
                isSelected
                  ? 'ring-2 ring-student-primary shadow-[0_0_0_4px_rgba(43,108,0,0.12)]'
                  : 'ring-1 ring-student-outline-variant/30 hover:ring-student-primary/40'
              }`}
            >
              <div className="relative aspect-video bg-student-surface-container-high">
                {feed.cameraOn ? (
                  <img
                    src={feed.feedPreview}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-student-on-surface-variant">
                    <Icon name="videocam_off" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-student-error/90 text-white text-[10px] font-bold uppercase">
                  <span className={`w-1.5 h-1.5 rounded-full ${liveStatusDot[feed.liveStatus]} pulse-live`} />
                  Live
                </span>

                {feed.lastFlag && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-student-error flex items-center justify-center">
                    <Icon name="warning" className="text-white text-[12px]" />
                  </span>
                )}
              </div>

              <div className="p-3 bg-student-surface-container-low">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-student text-student-body-md font-semibold text-student-on-surface truncate">
                      {feed.name}
                    </p>
                    <p className="font-student text-student-label-md text-student-on-surface-variant truncate">
                      ID {feed.id}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${riskTone[feed.risk]}`}>
                    {feed.risk}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium truncate ${liveStatusTone[feed.liveStatus]}`}>
                    {feed.liveStatusLabel}
                  </span>
                  <span className={`text-student-label-md font-student font-bold shrink-0 ${
                    feed.integrityScore >= 80 ? 'text-student-primary' : feed.integrityScore >= 60 ? 'text-amber-600' : 'text-student-error'
                  }`}>
                    {feed.integrityScore}%
                  </span>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>

    {feeds.length === 0 && (
      <p className="p-6 text-center text-student-on-surface-variant font-student text-student-body-md">
        No feeds match your search.
      </p>
    )}
  </aside>
));

ProctoringStudentRail.displayName = 'ProctoringStudentRail';

export default ProctoringStudentRail;
