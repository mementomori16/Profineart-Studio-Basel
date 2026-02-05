import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoPlayer from '../../VideoPlayer/VideoPlayer';
import './videoPage.scss';

const VideoPage: React.FC = () => {
    const { t } = useTranslation();
    const myVideoId = "ucTuc7tvZDo"; 

    return (
        <section className="text-component-section masterclass-final">
            <div className="container">
                <header className="text-header">
                    <h2 className="text-main-title">{t('masterclass.title')}</h2>
                    <h3 className="text-subtitle masterclass-sub-size">{t('masterclass.subtitle')}</h3>
                </header>
                
                <div className="video-centering-wrapper">
                    <VideoPlayer videoId={myVideoId} />
                </div>
            </div>
        </section>
    );
};

export default VideoPage;