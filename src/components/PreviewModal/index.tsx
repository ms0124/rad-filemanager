import React, { useState, useContext, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Context } from '../../store/index';
import {
  ImageTypes,
  VideoTypes,
  DocumentTypes,
  AudioTypes
} from '../../config/types';
import { getThumbnailUrl, getFileUrl, formatBytes } from '../../utils/index';
import DefaultThumnail from '../StateColumnList/defaultThumbnail/index';
import styles from './style.module.scss';

interface IProps {
  isOpen: boolean;
  toggle: () => void;
  item: {
    name: string;
    hash: string;
    extension: string;
    type: string;
    size?: number;
  };
  allFiles?: any[];
}

const PreviewModal: React.FunctionComponent<IProps> = ({
  isOpen,
  toggle,
  item,
  allFiles = []
}) => {
  const { isSandbox } = useContext(Context);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const isImageFile = (extension: string) => {
    return Object.values(ImageTypes).includes(
      extension.toLowerCase() as ImageTypes
    );
  };

  const isVideoFile = (extension: string) => {
    return Object.values(VideoTypes).includes(
      extension.toLowerCase() as VideoTypes
    );
  };

  const isAudioFile = (extension: string) => {
    return Object.values(AudioTypes).includes(
      extension.toLowerCase() as AudioTypes
    );
  };

  const isDocumentFile = (extension: string) => {
    return Object.values(DocumentTypes).includes(
      extension.toLowerCase() as DocumentTypes
    );
  };

  const handlePreview = () => {
    if (!item) {
      return;
    }

    const previewableFiles = allFiles.filter(
      (file) =>
        file?.extension &&
        (isImageFile(file.extension) ||
          isVideoFile(file.extension) ||
          isAudioFile(file.extension) ||
          isDocumentFile(file.extension) ||
          (!isImageFile(file.extension) &&
            !isVideoFile(file.extension) &&
            !isAudioFile(file.extension) &&
            !isDocumentFile(file.extension)))
    );

    const currentIndex = previewableFiles.findIndex(
      (file) => file.hash === item.hash
    );

    const slidesData = previewableFiles.map((file) => {
      if (isImageFile(file.extension)) {
        return {
          src: getThumbnailUrl(file.hash, isSandbox),
          alt: file.name,
          type: 'image',
          name: file.name,
          size: file.size,
          extension: file.extension
        };
      } else if (isVideoFile(file.extension)) {
        return {
          src: getFileUrl(file.hash, isSandbox),
          alt: file.name,
          type: 'video',
          name: file.name,
          size: file.size,
          extension: file.extension
        };
      } else {
        return {
          src: null,
          alt: file.name,
          type: 'file',
          name: file.name,
          size: file.size,
          extension: file.extension,
          icon: file.extension
        };
      }
    });

    setSlides(slidesData);
    return currentIndex;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const index = handlePreview();
      if (index !== undefined && index >= 0) {
        setCurrentSlideIndex(index);
      }
    } else {
      document.body.style.overflow = 'unset';
      setSlides([]);
      setCurrentSlideIndex(0);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setSlides([]);
    setCurrentSlideIndex(0);
    toggle();
  };

  const renderSlide = (slide: any) => {
    if (slide.type === 'video') {
      return (
        <div className={styles['preview-container']}>
          <video
            controls
            className={styles['preview-video']}
            src={slide.src}
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          >
            Your browser does not support the video tag.
          </video>
          <div className={styles['file-info']}>
            <h3 className={styles['file-name']}>{slide.name}</h3>
            <p className={styles['file-size']}>
              {formatBytes(slide.size || 0)}
            </p>
          </div>
        </div>
      );
    } else if (slide.type === 'file') {
      return (
        <div className={styles['preview-container']}>
          <div className={styles['file-preview']}>
            <DefaultThumnail
              item={{ extension: slide.extension }}
              size='5x'
              style={{ color: '#666' }}
            />
          </div>
          <div className={styles['file-info']}>
            <h3 className={styles['file-name']}>{slide.name}</h3>
            <p className={styles['file-size']}>
              {formatBytes(slide.size || 0)}
            </p>
          </div>
        </div>
      );
    } else {
      // Image files
      return (
        <div className={styles['preview-container']}>
          <img
            src={slide.src}
            alt={slide.alt}
            className={styles['preview-image']}
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
          <div className={styles['file-info']}>
            <h3 className={styles['file-name']}>{slide.name}</h3>
            <p className={styles['file-size']}>
              {formatBytes(slide.size || 0)}
            </p>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className={styles['preview-modal-overlay']} onClick={handleClose}>
      <div
        className={styles['preview-modal-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles['close-button']} onClick={handleClose}>
          ×
        </button>

        {currentSlide && renderSlide(currentSlide)}

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              className={`${styles['nav-button']} ${styles['nav-button-left']}`}
              onClick={() =>
                setCurrentSlideIndex((prev) =>
                  prev < slides.length - 1 ? prev + 1 : 0
                )
              }
            >
              {`›`}
            </button>
            <button
              className={`${styles['nav-button']} ${styles['nav-button-right']}`}
              onClick={() =>
                setCurrentSlideIndex((prev) =>
                  prev > 0 ? prev - 1 : slides.length - 1
                )
              }
            >
              {`‹`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
