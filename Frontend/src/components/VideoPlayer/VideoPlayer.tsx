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
  const [isZoomed, setIsZoomed] = useState(true); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

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
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setTimeout(() => {
                setIsZoomed(false);
              }, 6000);
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
          if (duration > 0 && currentTime >= (duration - 4)) {
            playerRef.current.seekTo(0);
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

  const toggleMute = () => {
    if (playerRef.current) {
      isMuted ? playerRef.current.unMute() : playerRef.current.mute();
      setIsMuted(!isMuted);
    }
  };

  const handleToggleExpand = () => {
    if (!document.fullscreenElement) {
      const el = containerRef.current as any;
      if (el.requestFullscreen) el.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className={`studio-video-master ${isFullscreen ? 'is-expanded' : ''}`}>
      <div className={`video-inner-container ${isZoomed ? 'zoomed-view' : 'normal-view'}`}>
        <div id={`Youtubeer-${videoId}`} className="video-iframe" />
      </div>

      <div className="custom-player-ui">
        <button className="ui-pill" onClick={toggleMute}>
          {isMuted ? "TAP FOR SOUND" : "MUTE"}
        </button>
        <button className="ui-pill" onClick={handleToggleExpand}>
          {isFullscreen ? "EXIT" : "EXPAND"}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;