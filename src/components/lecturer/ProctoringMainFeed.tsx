import { memo } from 'react';
import Icon from '../student/Icon';
import type { ProctoringFeed } from '../../data/proctoringData';
import { liveStatusTone, riskTone } from '../../data/proctoringData';

type ProctoringMainFeedProps = {
  feed: ProctoringFeed;
  onWarn?: () => void;
  onViewTimeline?: () => void;
  onToggleAudio?: () => void;
  audioMuted?: boolean;
};

const integrityClass = (score: number) =>
  score >= 80 ? 'text-student-primary' : score >= 60 ? 'text-amber-600' : 'text-student-error';

const ProctoringMainFeed = memo(({
  feed,
  onWarn,
  onViewTimeline,
  onToggleAudio,
  audioMuted = false,
}: ProctoringMainFeedProps) => (
  <section className="bg-student-surface rounded-[24px] lecturer-card-elevation overflow-hidden flex flex-col">
    <div className="relative aspect-video bg-student-inverse-surface overflow-hidden">
      {feed.cameraOn ? (
        <>
          <img
            src={feed.feedPreview}
            alt={`Live feed — ${feed.name}`}
            className="absolute inset-0 w-full h-full object-cover proctoring-feed-scan"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-student-surface-container-high text-student-on-surface-variant gap-3">
          <Icon name="videocam_off" className="text-5xl opacity-50" />
          <p className="font-student text-student-body-md">Camera offline</p>
        </div>
      )}

      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-student-error/90 text-white font-student text-student-label-md font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-white pulse-live" />
          Live
        </span>
        <span className={`px-3 py-1 rounded-full border font-student text-student-label-md font-medium ${liveStatusTone[feed.liveStatus]}`}>
          {feed.liveStatusLabel}
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full font-student text-student-label-md font-bold capitalize ${riskTone[feed.risk]}`}>
          {feed.risk} risk
        </span>
        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white font-student text-student-label-md flex items-center gap-1.5">
          <Icon name="schedule" className="text-sm" />
          Since {feed.streamingSince}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-white font-student text-student-headline-md font-bold truncate drop-shadow-md">
            {feed.name}
          </h2>
          <p className="text-white/80 font-student text-student-body-md flex items-center gap-2 mt-0.5">
            <Icon name="badge" className="text-sm" />
            ID {feed.id}
            {feed.seatLabel && (
              <>
                <span className="text-white/50">·</span>
                {feed.seatLabel}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm text-center">
            <p className="text-white/70 font-student text-student-label-md uppercase tracking-wider">Integrity</p>
            <p className={`font-student text-student-headline-sm font-bold ${integrityClass(feed.integrityScore)}`}>
              {feed.integrityScore}%
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm min-w-[100px]">
            <p className="text-white/70 font-student text-student-label-md uppercase tracking-wider mb-1">Audio</p>
            <div className="flex items-end gap-0.5 h-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-all ${
                    i < Math.round((feed.audioLevel / 100) * 8)
                      ? feed.audioLevel > 60
                        ? 'bg-student-error'
                        : 'bg-student-primary-fixed'
                      : 'bg-white/20'
                  }`}
                  style={{ height: `${((i + 1) / 8) * 100}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {feed.lastFlag && (
      <div className="px-4 py-3 bg-student-error-container/30 border-b border-student-error/20 flex items-center gap-2">
        <Icon name="warning" className="text-student-error shrink-0" />
        <p className="text-student-on-error-container font-student text-student-body-md truncate">{feed.lastFlag}</p>
      </div>
    )}

    <div className="p-4 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-student-surface-variant/50">
      <button
        type="button"
        onClick={onWarn}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-student-error-container text-student-on-error-container font-student font-bold text-student-body-md hover:opacity-90 transition-opacity"
      >
        <Icon name="campaign" />
        Warn Student
      </button>

      <button
        type="button"
        onClick={onViewTimeline}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-student-primary text-student-primary font-student font-bold text-student-body-md hover:bg-student-primary/5 transition-colors"
      >
        <Icon name="timeline" />
        View Timeline
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-student-outline-variant text-student-on-surface-variant font-student font-semibold text-student-body-md hover:bg-student-surface-container-high transition-colors"
      >
        <Icon name="photo_camera" />
        Snapshot
      </button>

      <button
        type="button"
        onClick={onToggleAudio}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-student-outline-variant text-student-on-surface-variant font-student font-semibold text-student-body-md hover:bg-student-surface-container-high transition-colors ml-auto"
      >
        <Icon name={audioMuted ? 'volume_off' : 'volume_up'} />
        {audioMuted ? 'Unmute' : 'Mute'} Audio
      </button>

      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-student-outline-variant text-student-on-surface-variant font-student font-semibold text-student-body-md hover:bg-student-surface-container-high transition-colors"
        aria-label="Fullscreen"
      >
        <Icon name="fullscreen" />
      </button>
    </div>
  </section>
));

ProctoringMainFeed.displayName = 'ProctoringMainFeed';

export default ProctoringMainFeed;
