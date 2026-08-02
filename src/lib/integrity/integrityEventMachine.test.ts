import { afterEach, describe, expect, it, vi } from 'vitest';
import { IntegrityEventMachine } from './integrityEventMachine';

afterEach(() => vi.useRealTimers());

describe('IntegrityEventMachine', () => {
  it('requires two frames to enter and leave gaze deviation', () => {
    vi.useFakeTimers();
    const events: string[] = [];
    const machine = new IntegrityEventMachine((event) => events.push(event.type));
    machine.updateGaze(true);
    expect(events).toEqual([]);
    machine.updateGaze(true);
    expect(events).toEqual(['gaze_deviation_start']);
    vi.advanceTimersByTime(4_000);
    machine.updateGaze(false);
    expect(events).toHaveLength(1);
    machine.updateGaze(false);
    expect(events).toEqual(['gaze_deviation_start', 'gaze_deviation_end']);
  });

  it('debounces duplicate tab blur signals', () => {
    const events: string[] = [];
    const machine = new IntegrityEventMachine((event) => events.push(event.type));
    machine.onTabBlur();
    machine.onTabBlur();
    expect(events).toEqual(['tab_blur']);
    expect(machine.getTabBlurCount()).toBe(1);
  });
});
