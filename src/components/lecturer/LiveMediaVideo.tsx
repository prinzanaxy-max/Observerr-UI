import { memo, useEffect, useRef } from 'react';

type LiveMediaVideoProps = {
  stream: MediaStream;
  muted?: boolean;
  className?: string;
  label: string;
};

const LiveMediaVideo = memo(
  ({ stream, muted = true, className, label }: LiveMediaVideoProps) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      const video = ref.current;
      if (!video) return;
      video.srcObject = stream;
      void video.play().catch(() => {
        // Browser autoplay policy may require the lecturer to unmute manually.
      });
      return () => {
        video.srcObject = null;
      };
    }, [stream]);

    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        aria-label={label}
        className={className}
      />
    );
  },
);

LiveMediaVideo.displayName = 'LiveMediaVideo';
export default LiveMediaVideo;
