import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoPlayer from '../../VideoPlayer/VideoPlayer';
import './videoPage.scss';

const VideoPage: React.FC = () => {
    const { t } = useTranslation();
    const myVideoId = "ucTuc7tvZDo"; 

    return (
        <section className="text-component-section masterclass-final-clean">
            <div className="container">
                {/* Header matches Text component structure exactly */}
                <header className="text-header">
                    <h2 className="text-main-title">{t('masterclass.title')}</h2>
                </header>
                
                {/* Subtitle appears AFTER the line */}
                <div className="subtitle-wrapper">
                    <h3 className="text-subtitle masterclass-sub-size">{t('masterclass.subtitle')}</h3>
                </div>

                {/* Centered video with rounded corners */}
                <div className="video-centering-wrapper">
                    <VideoPlayer videoId={myVideoId} />
                </div>
            </div>
        </section>
    );
};

export default VideoPage;