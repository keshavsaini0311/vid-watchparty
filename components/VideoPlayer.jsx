import { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

export default function VideoPlayer({ vidurl, onPlay, onPause, playing, currentTime }) {
  const videoRef = useRef(null);
  const tooltipVideoRef = useRef(null);
  const lastTimeUpdate = useRef(currentTime);
  const [hoveredSecond, setHoveredSecond] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);

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

  // Handle controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showVolumeSlider) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (!showVolumeSlider) {
      setShowControls(false);
    }
  };

  useEffect(() => {
    const container = videoRef.current?.parentElement;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, [showVolumeSlider]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        if (playing) {
          handlePause();
        } else {
          handlePlay();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playing]);

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

  const handleSeekHover = (e) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * videoRef.current.duration;
    
    setHoveredSecond(time);
    setShowPreview(true);
    
    // Calculate position to keep preview within bounds
    const previewWidth = 160; // w-40 = 10rem = 160px
    const maxX = rect.width - previewWidth;
    const previewX = Math.min(Math.max(x - previewWidth/2, 0), maxX);
    
    setPreviewPosition({ x: previewX, y: -150 });

    // Update preview video time
    if (tooltipVideoRef.current) {
      tooltipVideoRef.current.currentTime = time;
    }
  };

  const handleSeekLeave = () => {
    setShowPreview(false);
  };

  const handleSeekClick = (e) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    
    const seekBar = e.currentTarget;
    const rect = seekBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * videoRef.current.duration;
    
    videoRef.current.currentTime = time;
    onPlay(time);
  };

  const handleVideoClick = (e) => {
    // Don't toggle if clicking on controls or seek bar
    if (e.target.closest('.controls-overlay') || e.target.closest('.seek-bar')) {
      return;
    }
    
    if (playing) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
      } else {
        videoRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-black relative group" onClick={handleVideoClick}>
      {vidurl && (
        <>
          <video
            className='h-[calc(100vh-3.5rem)] w-full object-contain cursor-pointer'
            ref={videoRef}
            src={vidurl}
            onPause={handlePause}
            onPlay={handlePlay}
            onTimeUpdate={handleTimeUpdate}
            muted={isMuted}
          />
          
          {/* Controls overlay */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 via-slate-900/80 to-transparent p-4 transition-all duration-300 controls-overlay pointer-events-none ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative w-full h-full pointer-events-auto">
              {/* Play/Pause button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  playing ? handlePause() : handlePlay();
                }}
                className="absolute bottom-16 left-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 transition-colors border border-slate-700/50"
              >
                {playing ? (
                  <Pause className="w-6 h-6 text-slate-200" />
                ) : (
                  <Play className="w-6 h-6 text-slate-200" />
                )}
              </button>

              {/* Time display */}
              <div className="absolute bottom-16 left-16 text-slate-200 text-sm font-medium">
                {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
              </div>

              {/* Volume and Fullscreen controls */}
              <div className="absolute bottom-16 right-4 flex items-center gap-2">
                {/* Volume controls */}
                <div className="flex items-center group/volume"
                     onMouseEnter={() => setShowVolumeSlider(true)}
                     onMouseLeave={() => setShowVolumeSlider(false)}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 transition-colors border border-slate-700/50"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-6 h-6 text-slate-200" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-slate-200" />
                    )}
                  </button>
                  
                  {/* Volume slider */}
                  <div className={`ml-2 w-24 h-1.5 bg-slate-800/50 rounded-full relative transition-all duration-200 ${showVolumeSlider ? 'opacity-100' : 'opacity-0'}`}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="absolute w-full h-full opacity-0 cursor-pointer"
                    />
                    <div 
                      className="absolute h-full bg-blue-600 rounded-full"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>

                {/* Fullscreen button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 transition-colors border border-slate-700/50"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-6 h-6 text-slate-200" />
                  ) : (
                    <Maximize2 className="w-6 h-6 text-slate-200" />
                  )}
                </button>
              </div>
              
              {/* Custom seek bar with preview */}
              <div className="absolute bottom-4 left-0 right-0 py-2 cursor-pointer group/seek seek-bar"
                   onMouseMove={handleSeekHover}
                   onMouseLeave={handleSeekLeave}
                   onClick={(e) => {
                     e.stopPropagation();
                     handleSeekClick(e);
                   }}>
                <div className="h-1.5 bg-slate-800/50 rounded-full relative">
                  <div className="absolute h-full bg-blue-600 rounded-full" 
                       style={{ width: `${(videoRef.current?.currentTime / videoRef.current?.duration) * 100}%` }} />
                  
                  {/* Preview tooltip */}
                  {showPreview && (
                    <div className="absolute bg-slate-900/95 rounded-lg p-2 shadow-lg border border-slate-700/50"
                         style={{ left: `${previewPosition.x}px`, top: `${previewPosition.y}px` }}>
                      <video
                        ref={tooltipVideoRef}
                        src={vidurl}
                        className="w-40 h-auto rounded"
                        muted
                        preload="auto"
                      />
                      <div className="text-slate-200 text-sm mt-1 font-medium">{formatTime(hoveredSecond)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 