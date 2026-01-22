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
    // 1. LOAD YOUTUBE API IF NOT PRESENT
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // 2. INITIALIZE PLAYER
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
            event.target.setVolume(50);
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            // Once the video actually starts playing, we wait 3s then hide the loader
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

    // 3. SEAMLESS LOOP LOGIC
    let interval: NodeJS.Timeout;
    const startLoopCheck = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (playerRef.current?.getCurrentTime) {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          // Loop 3 seconds before the end to avoid YouTube's "Related Videos" screen
          if (duration > 0 && currentTime >= (duration - 3)) {
            playerRef.current.seekTo(0);
            playerRef.current.playVideo();
          }
        }
      }, 100);
    };

    // 4. PERFORMANCE: PAUSE VIDEO WHEN NOT IN VIEW
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

  // 5. SYNC MUTE STATE
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(50);
      }
    }
  }, [isMuted]);

  return (
    <div ref={containerRef} className="studio-video-master">
      
      {/* LOADING SCREEN WITH ICON */}
      <div className={`video-placeholder ${isFullyLoaded ? 'hidden' : ''}`}>
        <div className="loader-content">
          <div className="video-spinner" />
          <div className="modern-loader">PROFINEART STUDIO BASEL</div>
        </div>
      </div>

      {/* THE ACTUAL VIDEO */}
      <div className="video-inner-container">
        <div id={`Youtubeer-${videoId}`} className="video-iframe" />
      </div>

      {/* INTERACTIVE CONTROLS */}
      <button 
        className="small-sound-pill" 
        onClick={() => setIsMuted(!isMuted)}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? "TAP FOR SOUND" : "MUTE"}
      </button>
      
    </div>
  );
};

export default VideoPlayer;