import { useState, useEffect } from 'react';
import './StudentArtwork.scss';

interface Artwork {
    id: number;
    url: string;      
    highRes: string;  
    title: string;
}

const artworks: Artwork[] = [
    { 
        id: 1, 
        url: 'https://i.ibb.co/DTFv3k1/PXL-202511-500kb.jpg', 
        highRes: 'https://i.ibb.co/DTFv3k1/PXL-202511-500kb.jpg',
        title: 'Oil Landskape Process' 
    },
    { 
        id: 3, 
        url: 'https://i.ibb.co/4wzFDgzz/DSC-8392-120kb.jpg', 
        highRes: 'https://i.ibb.co/d4r83Ly9/DSC-8392-500kb.jpg',
        title: 'Roman Sculpture Oil Study' 
    },
    { 
        id: 4, 
        url: 'https://i.ibb.co/0jmLH9Bv/DSC-1939-500kb.jpg', 
        highRes: 'https://i.ibb.co/0jmLH9Bv/DSC-1939-500kb.jpg',
        title: 'Sea Thematic. Acrylic on Canvas work process' 
    },
];

export default function StudentArtwork() {
    const [index, setIndex] = useState(0);
    const [displayUrl, setDisplayUrl] = useState(artworks[0].url);
    const [isHD, setIsHD] = useState(false);

    useEffect(() => {
        const current = artworks[index];
        
        // Set low-res immediately
        setDisplayUrl(current.url);
        setIsHD(false);

        // Background load the HD version
        const img = new Image();
        img.src = current.highRes;
        img.onload = () => {
            setDisplayUrl(current.highRes);
            setIsHD(true);
        };
    }, [index]);

    const handlePrev = () => setIndex(i => (i === 0 ? artworks.length - 1 : i - 1));
    const handleNext = () => setIndex(i => (i === artworks.length - 1 ? 0 : i + 1));

    return (
        <div className="artwork-carousel-wrapper">
            <div className="carousel-main">
                <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous">
                    <span className="arrow-icon"></span>
                </button>

                <div className="img-container">
                    <img 
                        src={displayUrl} 
                        alt={artworks[index].title} 
                        className={`artwork-img ${isHD ? 'hd-loaded' : 'low-res'}`} 
                    />
                </div>

                {/* Bright white, left-aligned title */}
                <p className="artwork-caption">{artworks[index].title}</p>

                <button className="nav-arrow next" onClick={handleNext} aria-label="Next">
                    <span className="arrow-icon"></span>
                </button>
            </div>
        </div>
    );
}


