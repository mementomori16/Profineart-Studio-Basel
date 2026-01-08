import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './viewGallery.scss';

interface ImageData {
  url: string;
  title: string;
  date: string;
}

interface ViewGalleryProps {
  images: ImageData[];
  currentImageId: number;
  onClose: () => void;
}

const ViewGallery: React.FC<ViewGalleryProps> = ({ images, currentImageId, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageId);
  const [transformWrapperRef, setTransformWrapperRef] = useState<any>(null);
  const [maxScale, setMaxScale] = useState<number>(2);
  const [opacity, setOpacity] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState(false); // Track if current image is fully downloaded

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex) return;
    transitionToImage(index);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    transitionToImage(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    transitionToImage(prevIndex);
  };

  const transitionToImage = (index: number) => {
    setOpacity(0);
    setIsLoaded(false); // Reset loading state for the new image
    
    setTimeout(() => {
      setCurrentIndex(index);
      resetZoom();
      // Note: We don't set opacity to 1 here anymore. 
      // It will be set in the useEffect once the image is confirmed loaded.
    }, 600); 
  };

  const handleZoomIn = () => transformWrapperRef?.zoomIn();
  const handleZoomOut = () => transformWrapperRef?.zoomOut();
  const resetZoom = () => transformWrapperRef?.resetTransform();

  // --- SILENT LOADING LOGIC ---
  useEffect(() => {
    if (images.length === 0 || currentIndex < 0 || currentIndex >= images.length) return;

    const img = new Image();
    img.src = images[currentIndex].url; 
    
    img.onload = () => {
      // 1. Determine Max Scale based on resolution
      const { width, height } = img;
      setMaxScale(width < 800 || height < 800 ? 1.5 : 3);

      // 2. Trigger the "Loaded" state and fade in
      setIsLoaded(true);
      setOpacity(1); 
    };
  }, [currentIndex, images]);

  return (
    <div className="viewGallery">
      <button className="close-button" onClick={onClose}>X</button>

      <TransformWrapper
        ref={setTransformWrapperRef}
        centerOnInit={true}
        maxScale={maxScale}
        initialScale={1}
        minScale={1}
        doubleClick={{ disabled: true }}
        limitToBounds={false}
        minPositionX={-Infinity}
        maxPositionX={Infinity}
        minPositionY={-Infinity}
        maxPositionY={Infinity}
      >
        <TransformComponent>
          {images.length > 0 && (
            <img
              src={images[currentIndex].url}
              alt={`Image ${currentIndex}`}
              // Combine your transition opacity with the loading state
              className={`largeImage ${isLoaded ? 'loaded' : ''}`}
              style={{ opacity: isLoaded ? opacity : 0 }} 
            />
          )}
        </TransformComponent>
      </TransformWrapper>
    
      {images.length > 0 && (
        <div className="imageInfo" style={{ opacity }}>
          <h2 className="imageTitle">{images[currentIndex].title}</h2>
          <p className="imageDate">{images[currentIndex].date}</p>
        </div>
      )}

      <div className="thumbnailsContainer">
        <div className="thumbnails">
          {images.map((image, index) => (
            <div key={index} className="thumbnailContainer">
              <img
                src={image.url}
                alt={`Thumbnail ${index}`}
                className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="zoomControls">
        <button className="zoomButton" onClick={handleZoomIn}>
          <span className="icon">+</span>
        </button>
        <button className="zoomButton" onClick={handleZoomOut}>
          <span className="icon">-</span>
        </button>
      </div>

      <button className="arrow top-left" onClick={handlePrev}>&lt;</button>
      <button className="arrow top-right" onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default ViewGallery;






































