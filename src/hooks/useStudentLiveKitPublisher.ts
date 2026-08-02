import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConnectionState,
  Room,
  RoomEvent,
  Track,
  type LocalTrackPublication,
} from 'livekit-client';
import {
  fetchStudentMediaToken,
  isMediaUnavailable,
  resolveLiveKitUrl,
} from '../services/proctoringMediaService';
import type { ProctoringMediaState } from '../types/proctoringMedia';

export function useStudentLiveKitPublisher({
  sessionId,
  mediaStream,
  enabled,
}: {
  sessionId: string | null;
  mediaStream: MediaStream | null;
  enabled: boolean;
}) {
  const roomRef = useRef<Room | null>(null);
  const publicationsRef = useRef<LocalTrackPublication[]>([]);
  const generationRef = useRef(0);
  const [state, setState] = useState<ProctoringMediaState>('disabled');
  const [error, setError] = useState<string | null>(null);

  const disconnect = useCallback(async () => {
    generationRef.current += 1;
    const room = roomRef.current;
    roomRef.current = null;
    if (!room) return;
    const publications = publicationsRef.current;
    publicationsRef.current = [];
    await Promise.allSettled(
      publications
        .map((publication) => publication.track)
        .filter((track): track is NonNullable<typeof track> => Boolean(track))
        .map((track) => room.localParticipant.unpublishTrack(track, false)),
    );
    room.disconnect(false);
    setState('disconnected');
  }, []);

  useEffect(() => {
    if (!enabled || !sessionId || !mediaStream) {
      return undefined;
    }

    const generation = ++generationRef.current;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;
    queueMicrotask(() => {
      if (generation === generationRef.current) {
        setState('connecting');
        setError(null);
      }
    });

    room.on(RoomEvent.ConnectionStateChanged, (connectionState) => {
      if (generation !== generationRef.current) return;
      if (connectionState === ConnectionState.Connected) setState('connected');
      else if (connectionState === ConnectionState.Reconnecting) setState('reconnecting');
      else if (connectionState === ConnectionState.Disconnected) setState('disconnected');
    });

    const connect = async () => {
      try {
        const credentials = await fetchStudentMediaToken(sessionId);
        const url = resolveLiveKitUrl(credentials);
        if (!url) throw new Error('LiveKit URL is not configured');
        if (generation !== generationRef.current) return;
        await room.connect(url, credentials.token);
        if (generation !== generationRef.current) {
          room.disconnect();
          return;
        }

        const publications: LocalTrackPublication[] = [];
        const videoTrack = mediaStream.getVideoTracks()[0];
        const audioTrack = mediaStream.getAudioTracks()[0];
        if (!videoTrack) throw new Error('Camera track is unavailable');
        publications.push(
          await room.localParticipant.publishTrack(videoTrack, {
            source: Track.Source.Camera,
            stopMicTrackOnMute: false,
          }),
        );
        if (audioTrack) {
          publications.push(
            await room.localParticipant.publishTrack(audioTrack, {
              source: Track.Source.Microphone,
              stopMicTrackOnMute: false,
            }),
          );
        }
        publicationsRef.current = publications;
        setState('connected');
      } catch (cause) {
        if (generation !== generationRef.current) return;
        room.disconnect(false);
        setState(isMediaUnavailable(cause) ? 'unavailable' : 'error');
        setError(
          cause instanceof Error ? cause.message : 'Live proctoring video is unavailable',
        );
      }
    };

    void connect();
    return () => {
      if (generation === generationRef.current) void disconnect();
    };
  }, [disconnect, enabled, mediaStream, sessionId]);

  return { state, error, disconnect };
}
