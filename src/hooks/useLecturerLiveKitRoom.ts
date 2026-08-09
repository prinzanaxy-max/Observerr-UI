import { useEffect, useRef, useState } from 'react';
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  VideoQuality,
  type RemoteParticipant,
  type RemoteTrackPublication,
} from 'livekit-client';
import {
  fetchLecturerMediaToken,
  isMediaUnavailable,
  resolveLiveKitUrl,
} from '../services/proctoringMediaService';
import type { ProctoringMediaState } from '../types/proctoringMedia';
import { videoPreferenceForParticipant } from '../lib/proctoringSelection';

export type LiveParticipantState = {
  identity: string;
  stream: MediaStream;
  connected: boolean;
  cameraOn: boolean;
  micOn: boolean;
  audioLevel: number;
};

function participantState(
  participant: RemoteParticipant,
  previous?: LiveParticipantState,
): LiveParticipantState {
  const tracks = [...participant.trackPublications.values()]
    .map((publication) => publication.track?.mediaStreamTrack)
    .filter((track): track is MediaStreamTrack => Boolean(track));
  const previousTracks = previous?.stream.getTracks() ?? [];
  const canReuseStream =
    previousTracks.length === tracks.length &&
    tracks.every((track) => previousTracks.some((item) => item.id === track.id));
  return {
    identity: participant.identity,
    stream: canReuseStream ? previous!.stream : new MediaStream(tracks),
    connected: true,
    cameraOn: tracks.some((track) => track.kind === 'video' && track.readyState === 'live'),
    micOn: tracks.some(
      (track) => track.kind === 'audio' && track.readyState === 'live' && track.enabled,
    ),
    audioLevel: Math.round(participant.audioLevel * 100),
  };
}

export function useLecturerLiveKitRoom(
  examId: number | null,
  selectedIdentity: string | null,
) {
  const roomRef = useRef<Room | null>(null);
  const [state, setState] = useState<ProctoringMediaState>('disabled');
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState(
    new Map<string, LiveParticipantState>(),
  );
  const [retryAttempt, setRetryAttempt] = useState(0);
  const retryTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (examId === null) {
      return undefined;
    }
    let cancelled = false;
    // Tracks are rendered through stable MediaStreams rather than RemoteTrack.attach().
    // Explicit quality selection below replaces LiveKit's element-based adaptive stream.
    const room = new Room({ adaptiveStream: false, dynacast: true });
    roomRef.current = room;
    queueMicrotask(() => {
      if (!cancelled) {
        setState('connecting');
        setError(null);
      }
    });
    const refresh = () => {
      setParticipants((previous) => {
        const next = new Map<string, LiveParticipantState>();
        for (const participant of room.remoteParticipants.values()) {
          next.set(
            participant.identity,
            participantState(participant, previous.get(participant.identity)),
          );
        }
        return next;
      });
    };

    room.on(RoomEvent.ConnectionStateChanged, (connectionState) => {
      if (connectionState === ConnectionState.Connected) setState('connected');
      else if (connectionState === ConnectionState.Reconnecting) setState('reconnecting');
      else if (connectionState === ConnectionState.Disconnected) {
        setState('disconnected');
        if (retryTimerRef.current !== null) return;
        retryTimerRef.current = window.setTimeout(() => {
          retryTimerRef.current = null;
          setRetryAttempt((attempt) => attempt + 1);
        }, 5_000);
      }
      refresh();
    });
    room.on(RoomEvent.ParticipantConnected, refresh);
    room.on(RoomEvent.ParticipantDisconnected, refresh);
    room.on(RoomEvent.TrackSubscribed, refresh);
    room.on(RoomEvent.TrackUnsubscribed, refresh);
    room.on(RoomEvent.TrackMuted, refresh);
    room.on(RoomEvent.TrackUnmuted, refresh);
    room.on(RoomEvent.ActiveSpeakersChanged, refresh);

    const connect = async () => {
      try {
        const credentials = await fetchLecturerMediaToken(examId);
        const url = resolveLiveKitUrl(credentials);
        if (!url) throw new Error('LiveKit URL is not configured');
        if (cancelled) return;
        await room.connect(url, credentials.token);
        if (!cancelled) {
          setState('connected');
          refresh();
        }
      } catch (cause) {
        if (cancelled) return;
        setState(isMediaUnavailable(cause) ? 'unavailable' : 'error');
        setError(cause instanceof Error ? cause.message : 'Live video is unavailable');
      }
    };
    void connect();

    return () => {
      cancelled = true;
      if (retryTimerRef.current !== null) {
        window.clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      roomRef.current = null;
      room.disconnect();
    };
  }, [examId, retryAttempt]);

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;
    for (const participant of room.remoteParticipants.values()) {
      const preference = videoPreferenceForParticipant(
        participant.identity,
        selectedIdentity,
      );
      for (const publication of participant.videoTrackPublications.values()) {
        const remotePublication = publication as RemoteTrackPublication;
        remotePublication.setSubscribed(true);
        if (publication.source === Track.Source.Camera) {
          remotePublication.setVideoQuality(
            preference === 'high' ? VideoQuality.HIGH : VideoQuality.LOW,
          );
        }
      }
    }
  }, [participants, selectedIdentity]);

  return { state, error, participants };
}
