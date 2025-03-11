import { useRef, useEffect } from 'react';

export default function VideoPlayer({ vidurl, onPlay, onPause, playing, currentTime }) {
  const videoRef = useRef(null);
  const lastTimeUpdate = useRef(currentTime);

  // Handle play/pause sync
  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  // Handle timestamp sync
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1) {
      videoRef.current.currentTime = currentTime;
      lastTimeUpdate.current = currentTime;
    }
  }, [currentTime]);

  const handlePlay = () => {
    onPlay(videoRef.current.currentTime);
  };

  const handlePause = () => {
    onPause(videoRef.current.currentTime);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - lastTimeUpdate.current) > 1) {
      lastTimeUpdate.current = video.currentTime;
      if (playing) {
        onPlay(video.currentTime);
      } else {
        onPause(video.currentTime);
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-black">
      {vidurl && (
        <video
          className='h-[calc(100vh-3.5rem)] w-full object-contain'
          ref={videoRef}
          src={vidurl}
          onPause={handlePause}
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
          controls
          muted
        />
      )}
    </div>
  );
} 