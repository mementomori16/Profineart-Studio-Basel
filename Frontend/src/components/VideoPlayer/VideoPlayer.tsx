import React, { useState, useRef, useEffect } from 'react';
import './videoPlayer.scss';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false); 
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new window.YT.Player(`Youtubeer-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.setVolume(50); // Pre-set volume to 50%
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setTimeout(() => {
                setIsFullyLoaded(true);
              }, 3000); 
              startLoopCheck();
            }
          }
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    let interval: NodeJS.Timeout;
    const startLoopCheck = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0 && currentTime >= (duration - 3)) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
          }
        }
      }, 100);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (playerRef.current?.playVideo) {
          entry.isIntersecting ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (interval) clearInterval(interval);
      observer.disconnect();
    };
  }, [videoId]);

  // Sync Mute AND Volume
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(50); // Ensure it stays at 50% when unmuted
      }
    }
  }, [isMuted]);

  return (
    <div ref={containerRef} className="studio-video-master">
      <div className={`video-placeholder ${isFullyLoaded ? 'hidden' : ''}`}>
        <div className="modern-loader">PROFINEART STUDIO BASEL</div>
      </div>

      <div className="video-inner-container">
        <div id={`Youtubeer-${videoId}`} className="video-iframe" />
      </div>

      <button className="small-sound-pill" onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? "TAP FOR SOUND" : "MUTE"}
      </button>
    </div>
  );
};

export default VideoPlayer;