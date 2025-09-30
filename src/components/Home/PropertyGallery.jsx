import React, { useState, useEffect, useRef, useContext } from 'react';
import { FiEye, FiMapPin, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { PropertyContext } from '../../stores/propertyStore';

const PropertyGallery = () => {
  const {
    coverImages,
    coverImagesLoading,
    coverImagesError,
    fetchCoverImages,
    clearCoverImagesError
  } = useContext(PropertyContext);
  
  const [visibleImages, setVisibleImages] = useState(new Set());
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const galleryRef = useRef(null);

  // Initialize intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imageId = entry.target.getAttribute('data-image-id');
            setVisibleImages(prev => new Set([...prev, imageId]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Set up observers for each image and make them visible immediately as fallback
  useEffect(() => {
    if (coverImages.length > 0) {
      // Make all images visible immediately as fallback
      const imageIds = coverImages.map(img => img.id.toString());
      setVisibleImages(new Set(imageIds));
      
      if (galleryRef.current) {
        const imageElements = galleryRef.current.querySelectorAll('[data-image-id]');
        imageElements.forEach(element => {
          if (observerRef.current) {
            observerRef.current.observe(element);
          }
        });
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [coverImages]);

  // Fetch images on component mount
  useEffect(() => {
    fetchCoverImages();
  }, []);

  const handleImageClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleViewAllProperties = () => {
    navigate('/properties');
  };

  const handleRetry = () => {
    clearCoverImagesError();
    fetchCoverImages();
  };

  if (coverImagesLoading) {
    return (
      <section className="w-full py-16 px-4 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[var(--color-darkest)] mb-4">
              Featured Properties
            </h3>
            <p className="text-lg text-[var(--color-dark)] max-w-2xl mx-auto">
              Discover beautiful homes and apartments from our premium collection
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <FiRefreshCw className="w-8 h-8 animate-spin text-[var(--color-secondary)]" />
            <span className="ml-3 text-[var(--color-dark)]">Loading property images...</span>
          </div>
        </div>
      </section>
    );
  }

  if (coverImagesError) {
    return (
      <section className="w-full py-16 px-4 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[var(--color-darkest)] mb-4">
              Featured Properties
            </h3>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-600">{coverImagesError}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (coverImages.length === 0 && !coverImagesLoading) {
    return (
      <section className="w-full py-16 px-4 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[var(--color-darkest)] mb-4">
              Featured Properties
            </h3>
            <p className="text-lg text-[var(--color-dark)]">
              No property images available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4 bg-[var(--color-bg)]">
      <div className="w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-[var(--color-darkest)] mb-4">
            Featured Properties
          </h3>
          <p className="text-lg text-[var(--color-dark)] max-w-2xl mx-auto mb-6">
            Discover beautiful homes and apartments from our premium collection
          </p>
          <button
            onClick={handleViewAllProperties}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-darker)] text-white rounded-lg font-medium transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View All Properties
          </button>
        </div>

        {/* Property Gallery */}
        <div 
          ref={galleryRef}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-4" style={{ width: 'max-content' }}>
            {coverImages.map((image, index) => (
              <div
                key={image.id}
                data-image-id={image.id}
                className={`
                  relative group cursor-pointer flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden
                  transform transition-all duration-700 ease-out
                  ${visibleImages.has(image.id.toString()) 
                    ? 'translate-y-0 opacity-100 scale-100' 
                    : 'translate-y-0 opacity-100 scale-100'
                  }
                `}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
                onClick={() => handleImageClick(image.property_id)}
              >
                {/* Property Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.property_title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    // loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                      <FiEye className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Property Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-semibold text-lg mb-1 truncate">
                    {image.property_title}
                  </h4>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <FiMapPin className="w-4 h-4" />
                    <span>Property Details</span>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-sm text-[var(--color-dark)]">
            <span>Scroll horizontally to view more</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[var(--color-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default PropertyGallery;