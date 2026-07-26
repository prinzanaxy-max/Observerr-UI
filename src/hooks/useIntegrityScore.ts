import { useCallback, useRef, useState } from 'react';
import type { IntegrityEvent } from '../types/integrityMonitoring';
import {
  applyIntegrityEvent,
  INTEGRITY_STARTING_SCORE,
  type ScoreUpdate,
} from '../lib/integrity/integrityScoring';

export type IntegrityScoreState = {
  score: number;
  lastUpdate: ScoreUpdate | null;
  eventLog: IntegrityEvent[];
};

export function useIntegrityScore(initialScore = INTEGRITY_STARTING_SCORE) {
  const [score, setScore] = useState(initialScore);
  const [lastUpdate, setLastUpdate] = useState<ScoreUpdate | null>(null);
  const [eventLog, setEventLog] = useState<IntegrityEvent[]>([]);
  const tabBlurCountRef = useRef(0);
  const repeatedTabPenaltyAppliedRef = useRef(false);

  const handleIntegrityEvent = useCallback((event: IntegrityEvent) => {
    setEventLog((prev) => [...prev.slice(-99), event]);

    if (event.type === 'tab_blur') {
      tabBlurCountRef.current += 1;
    }

    setScore((current) => {
      let update = applyIntegrityEvent(current, event, tabBlurCountRef.current);

      if (
        event.type === 'tab_focus' &&
        tabBlurCountRef.current >= 3 &&
        !repeatedTabPenaltyAppliedRef.current
      ) {
        repeatedTabPenaltyAppliedRef.current = true;
        update = applyIntegrityEvent(current, event, tabBlurCountRef.current);
      }

      if (update) {
        setLastUpdate(update);
        return update.newScore;
      }
      return current;
    });
  }, []);

  return {
    score,
    lastUpdate,
    eventLog,
    handleIntegrityEvent,
  };
}
