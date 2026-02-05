import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoPlayer from '../../VideoPlayer/VideoPlayer';
import './videoPage.scss';

const VideoPage: React.FC = () => {
    const { t } = useTranslation();
    const myVideoId = "ucTuc7tvZDo"; 

    return (
        <section className="video-masterclass-section">
            <div className="content-boundary">
                <header className="text-header">
                    <h2 className="text-main-title">{t('masterclass.title')}</h2>
                </header>
                
                <div className="subtitle-wrap">
                    <h3 className="text-subtitle">{t('masterclass.subtitle')}</h3>
                </div>
            </div>

            <div className="video-viewport-wrapper">
                <VideoPlayer videoId={myVideoId} />
            </div>
        </section>
    );
};

export default VideoPage;