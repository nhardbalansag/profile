import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const ImageGallery = ({ images = [], title = 'Event' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full bg-gray-200 rounded-xl h-96">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[selectedIndex];
  const imageUrl = currentImage.upload_type === 'url'
    ? currentImage.upload_url
    : `${import.meta.env.VITE_APP_BACKEND_STORAGE_URL}${currentImage.upload_url}`;

  const goToPrevious = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index) => {
    setSelectedIndex(index);
  };

  return (
    <>
      {/* Main Gallery View */}
      <div className="w-full">
        {/* Main Image Display */}
        <div className="relative w-full overflow-hidden bg-gray-900 rounded-xl h-96">
          <img
            src={imageUrl}
            alt={`${title} - Image ${selectedIndex + 1}`}
            className="object-cover w-full h-full cursor-pointer"
            onClick={() => setIsFullscreen(true)}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute z-10 p-2 text-gray-900 transition-all -translate-y-1/2 rounded-full shadow-lg left-3 top-1/2 bg-white/80 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNext}
                className="absolute z-10 p-2 text-gray-900 transition-all -translate-y-1/2 rounded-full shadow-lg right-3 top-1/2 bg-white/80 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute px-3 py-1 text-sm font-medium text-white rounded-full bottom-3 right-3 bg-black/60 backdrop-blur-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 pb-2 mt-4 overflow-x-auto">
            {images.map((image, index) => {
              const thumbUrl = image.upload_type === 'url'
                ? image.upload_url
                : `${import.meta.env.VITE_APP_BACKEND_STORAGE_URL}${image.upload_url}`;

              return (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all border-2 ${
                    selectedIndex === index
                      ? 'border-orange-500 ring-2 ring-orange-300'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
          {/* Close Button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute p-2 text-gray-900 transition-all rounded-full shadow-lg top-4 right-4 bg-white/80 hover:bg-white"
            aria-label="Close fullscreen"
          >
            <X size={24} />
          </button>

          {/* Main Image in Fullscreen */}
          <div className="relative flex items-center justify-center w-full h-full">
            <img
              src={imageUrl}
              alt={`${title} - Image ${selectedIndex + 1}`}
              className="object-contain max-w-full max-h-full"
            />

            {/* Navigation Arrows in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute p-3 text-white transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 hover:bg-white/40"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute p-3 text-white transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 hover:bg-white/40"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image Counter in Fullscreen */}
            {images.length > 1 && (
              <div className="absolute px-4 py-2 text-sm font-medium text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/60 backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0 cursor-pointer -z-10"
            onClick={() => setIsFullscreen(false)}
          />
        </div>
      )}
    </>
  );
};

export default ImageGallery;
