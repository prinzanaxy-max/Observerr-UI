import { describe, expect, it } from 'vitest';
import { videoPreferenceForParticipant } from './proctoringSelection';

describe('LiveKit participant selection', () => {
  it('requests high quality only for the selected student', () => {
    expect(videoPreferenceForParticipant('session-a', 'session-a')).toBe('high');
    expect(videoPreferenceForParticipant('session-b', 'session-a')).toBe('low');
    expect(videoPreferenceForParticipant('session-b', null)).toBe('low');
  });
});
