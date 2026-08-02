export type ParticipantVideoPreference = 'high' | 'low';

export function videoPreferenceForParticipant(
  participantIdentity: string,
  selectedIdentity: string | null,
): ParticipantVideoPreference {
  return participantIdentity === selectedIdentity ? 'high' : 'low';
}
