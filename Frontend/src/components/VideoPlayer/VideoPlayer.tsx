import React, { useState, useRef, useEffect } from 'react';
import './videoPlayer.scss';

// Declare YouTube global for TypeScript
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Load YouTube SDK
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. Initialize Player
    window.onYouTubeIframeAPIReady = () => {
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
            setIsReady(true);
          },
          onStateChange: (event: any) => {
            // Buffer logic for "looping" 3 seconds early
            if (event.data === window.YT.PlayerState.PLAYING) {
              startLoopCheck();
            }
          }
        },
      });
    };

    // 3. Early Restart Logic (3 seconds before end)
    let interval: NodeJS.Timeout;
    const startLoopCheck = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0 && currentTime >= duration - 3) {
            playerRef.current.seekTo(0);
          }
        }
      }, 500);
    };

    // 4. Intersection Observer (Pause/Play)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (playerRef.current && playerRef.current.playVideo) {
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

  // Sync Mute
  useEffect(() => {
    if (playerRef.current && playerRef.current.mute) {
      isMuted ? playerRef.current.mute() : playerRef.current.unMute();
    }
  }, [isMuted]);

  return (
    <div id="studio-player-anchor" ref={containerRef} className="studio-video-master">
      <div className={`video-placeholder ${isReady ? 'hidden' : ''}`}>
        <div className="modern-loader">PROFINEART STUDIO</div>
      </div>

      <div className="video-inner-container">
        {/* The API replaces this div with an iframe */}
        <div id={`Youtubeer-${videoId}`} className="video-iframe" />
      </div>

      <button className="small-sound-pill" onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? "TAP FOR SOUND" : "MUTE"}
      </button>
    </div>
  );
};

export default VideoPlayer;