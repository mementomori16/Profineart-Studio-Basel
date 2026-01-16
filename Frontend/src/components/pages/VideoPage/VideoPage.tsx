import React from 'react';
import VideoPlayer from '../../VideoPlayer/VideoPlayer';

const VideoPage: React.FC = () => {
  const myVideoId = "ucTuc7tvZDo"; 

  return (
    <div className="standalone-video-page">
       <VideoPlayer videoId={myVideoId} />
    </div>
  );
};

export default VideoPage;