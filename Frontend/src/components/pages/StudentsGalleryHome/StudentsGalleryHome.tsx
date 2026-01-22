import { useState, useEffect } from 'react';
import './studentsGalleryHome.scss';

interface Artwork {
    id: number;
    url: string;      
    highRes: string;  
    title: string;
    coursePhase: string; // The "Evolve" style curriculum link
    description: string;
}

const artworks: Artwork[] = [
    { 
        id: 1, 
        url: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/c9CthBy/Dikla-nude-study-2019-120kb.jpg', 
        highRes: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/2Hz4zRg/Dikla-nude-study-2019-500kb.jpg',
        title: 'Oil Landscape Process',
        coursePhase: 'Oil Painting | Phase 4: En Plein Air',
        description: 'Mastering atmospheric perspective and rapid color blocking under natural light.'
    },
    { 
        id: 3, 
        url: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/gbncPwCY/Dikla-Roman-Head-2019-120kb.jpg', 
        highRes: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/Kxr1MgQd/Dikla-head-500kb.jpg',
        title: 'Roman Sculpture Oil Study',
        coursePhase: 'Oil Painting | Phase 2: Underpainting',
        description: 'Using charcoal and multi-layer glazing to establish structural volume.'
    },
    { 
        id: 4, 
        url: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/dJG2dZNY/Dubi-22024-07-05-120kb.jpg', 
        highRes: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/Jj4q7VKd/Dubi-2020-500kb.jpg',
        title: 'Commando Divers Series',
        coursePhase: 'Academic Drawing | Phase 3: Anatomy',
        description: 'Advanced freehand study of muscular tension without the use of projectors.'
    },
    { 
        id: 5, 
        url: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/dJG2dZNY/Dubi-22024-07-05-120kb.jpg', 
        highRes: 'https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/Vc91fTHN/DSC-0377-500kb.jpg',
        title: 'Commando Divers Series',
        coursePhase: 'Academic Drawing | Phase 3: Anatomy',
        description: 'Advanced freehand study of muscular tension without the use of projectors.'
    },
];

export default function StudentArtwork() {
    const [index, setIndex] = useState(0);
    const [displayUrl, setDisplayUrl] = useState(artworks[0].url);
    const [isHD, setIsHD] = useState(false);

    useEffect(() => {
        const current = artworks[index];
        setDisplayUrl(current.url);
        setIsHD(false);

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
        <div className="artwork-carousel-isolated">
            <div className="carousel-main-track">
                <button className="nav-arrow prev" onClick={handlePrev} aria-label="Previous"></button>

                <div className="artwork-display-frame">
                    <img 
                        src={displayUrl} 
                        alt={artworks[index].title} 
                        className={`carousel-img-bomba ${isHD ? 'is-hd' : 'is-loading'}`} 
                    />
                </div>

                <button className="nav-arrow next" onClick={handleNext} aria-label="Next"></button>
            </div>

            <div className="artwork-meta-section">
                <span className="course-badge">{artworks[index].coursePhase}</span>
                <h4 className="work-title">{artworks[index].title}</h4>
                <p className="work-logic">{artworks[index].description}</p>
            </div>
        </div>
    );
}
