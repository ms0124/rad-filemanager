import React, { useState, useContext, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Context } from '../../store/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import {
  ImageTypes,
  VideoTypes,
  DocumentTypes,
  AudioTypes
} from '../../config/types';
import { getThumbnailUrl, getFileUrl, formatBytes } from '../../utils/index';
import DefaultThumnail from '../StateColumnList/defaultThumbnail/index';
import styles from './style.module.scss';
import { useGetFileDetails } from '../../config/hooks';
import moment from 'moment-jalaali';
import CheckPermissions from '../../components/CheckPermissions/index';

const PANEL_MENU_SELECTORS = ['.app-body .sidebar', '.app-body .sidebar-v2'];

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

type EventTypeProps =
  | 'uploaded'
  | 'renamed'
  | 'copied'
  | 'moved'
  | 'deleted'
  | 'restored'
  | 'published'
  | 'sharedWithUser';

interface ChangeLogProps {
  eventType: EventTypeProps | string;
  timestamp: string | number;
  updatedBySsoId: string;
  updatedByUsername: string;
}

interface FileItem {
  size?: number;
  name?: string;
  extension?: string;
  created?: number;
  updated?: number;
  isPublic?: boolean;
  thumbnail?: string;
  hash?: string;
  metaData?: {
    changeLog?: ChangeLogProps[];
  };
}
interface SidebarItemProps {
  label?: string;
  value?: string | React.ReactNode;
}
const changeLogLabels: Record<string, string> = {
  uploaded: 'بارگذاری',
  renamed: 'تغییر نام',
  copied: 'کپی',
  moved: 'جابه‌جایی',
  deleted: 'آرشیو',
  restored: 'بازیابی',
  published: 'انتشار',
  sharedWithUser: 'اشتراک گذاری'
};

const getChangeLogAction = (eventType: string): string => {
  return changeLogLabels[eventType] || eventType;
};

const SidebarItem: React.FunctionComponent<SidebarItemProps> = ({
  label,
  value
}) => {
  return (
    <div className={styles['info-section__sidebar-item']}>
      <span>{label}</span>
      <span className={styles['info-section__sidebar-value']}>{value}</span>
    </div>
  );
};

const PreviewModal: React.FunctionComponent<IProps> = ({
  isOpen,
  toggle,
  item,
  allFiles = []
}) => {
  const { isSandbox } = useContext(Context);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const [menuOffset, setMenuOffset] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setMenuOffset(0);
      return;
    }

    let menu: HTMLElement | null = null;
    for (const selector of PANEL_MENU_SELECTORS) {
      menu = document.querySelector(selector) as HTMLElement | null;
      if (menu) break;
    }

    if (!menu) {
      setMenuOffset(0);
      return;
    }

    const target: HTMLElement = menu;

    const calcOffset = () => {
      const rect = target.getBoundingClientRect();
      const isOnRight = rect.left > window.innerWidth / 2;
      const hasSize = rect.width > 0;

      if (isOnRight && hasSize) {
        setMenuOffset(Math.max(0, window.innerWidth - rect.left));
      } else {
        setMenuOffset(0);
      }
    };

    calcOffset();

    const resizeObserver = new ResizeObserver(calcOffset);
    resizeObserver.observe(target);

    window.addEventListener('resize', calcOffset);
    target.addEventListener('transitionend', calcOffset);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calcOffset);
      target.removeEventListener('transitionend', calcOffset);
    };
  }, [isOpen]);

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
          src: getFileUrl(file.hash, isSandbox),
          alt: file.name,
          type: 'image',
          name: file.name,
          size: file.size,
          extension: file.extension,
          hash: file.hash
        };
      } else if (isVideoFile(file.extension)) {
        return {
          src: getFileUrl(file.hash, isSandbox),
          alt: file.name,
          type: 'video',
          name: file.name,
          size: file.size,
          extension: file.extension,
          hash: file.hash
        };
      } else {
        return {
          src: null,
          alt: file.name,
          type: 'file',
          name: file.name,
          size: file.size,
          extension: file.extension,
          icon: file.extension,
          hash: file.hash
        };
      }
    });

    setSlides(slidesData);
    return currentIndex;
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setShowSidebar(true);
      }, 10);
    } else {
      setShowSidebar(false);
    }
  }, [isOpen]);

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
          <video controls className={styles['preview-video']} src={slide.src}>
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (slide.type === 'file') {
      return (
        <div className={styles['preview-container']}>
          <div className={styles['file-preview']}>
            <DefaultThumnail
              item={{ extension: slide.extension }}
              size='5x'
              style={{ color: '#fff' }}
            />
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
          />
        </div>
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  const currentSlide = slides[currentSlideIndex];
  const {
    data: _fileData,
    isLoading,
    refetch
  } = useGetFileDetails(currentSlide?.hash ? currentSlide?.hash : item?.hash);

  let fileData: FileItem | null = null;
  if (_fileData) {
    fileData = _fileData.result[0];
  }

  useEffect(() => {
    if (slides[currentSlideIndex]?.hash) {
      refetch();
    }
  }, [currentSlideIndex]);
  const toMilliseconds = (timestamp: string | number) => {
    const value = Number(timestamp);

    const isSeconds = value < 10_000_000_000;
    return isSeconds ? value * 1000 : value;
  };

  const formatChangeLogDate = (timestamp: string | number) => {
    return moment(toMilliseconds(timestamp)).format('jYYYY/jMM/jDD');
  };

  const formatChangeLogTime = (timestamp: string | number) => {
    return moment(toMilliseconds(timestamp)).format('HH:mm');
  };

  const renderChangeLog = (changeLog?: ChangeLogProps[]) => {
    if (!changeLog || changeLog.length === 0) {
      return null;
    }

    return (
      <div className={styles['info-section__log-card']}>
        <span className={styles['info-section__log-title-wrapper']}>
          تاریخچه تغییرات
        </span>
        {changeLog.map((log, index) => {
          const action = getChangeLogAction(log.eventType);

          return (
            <div
              key={`${log.eventType}-${log.timestamp}-${index}`}
              className={styles['info-section__item-wrapper']}
            >
              <SidebarItem
                label='عملیات'
                value={`(${log.eventType}) ${action}`}
              />
              <SidebarItem label='کاربر' value={log.updatedByUsername} />
              <SidebarItem
                label='تاریخ'
                value={
                  <div className={styles['info-section__log-card-item']}>
                    <span>{formatChangeLogDate(log.timestamp)}</span>
                    {`: ساعت`}
                    &nbsp;
                    <span>{formatChangeLogTime(log.timestamp)}</span>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderPreview = (item: any) => {
    return (
      <div
        className={`${styles.sidebar} ${showSidebar ? styles.sidebarOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['info-section']}>
          <span className={styles['info-section__title-main']}>
            {/* <FontAwesomeIcon icon={faCircleInfo} /> */}
            اطلاعات فایل
          </span>
          <span className={styles['info-section__close']} onClick={handleClose}>
            ×
          </span>
        </div>
        <br />
        <br />
        <br />
        {/* <div className={styles['info-section__icon']}>
          {fileData?.thumbnail?.startsWith('THUMBNAIL_EXIST') ? (
            <img
              className={styles['info-section__img']}
              src={getFileUrl(fileData?.hash, isSandbox)}
            />
          ) : (
            <DefaultThumnail
              item={{ extension: currentSlide?.extension }}
              size='5x'
              // style={}
            />
          )}
        </div> */}
        <div className={styles['info-section__name']}> {item.name} </div>
        <div className={styles['info-section__card']}>
          <SidebarItem label='نوع فایل' value={fileData?.extension} />
          <SidebarItem
            label='اندازه فایل'
            value={formatBytes(fileData?.size || 0)}
          />
          <SidebarItem
            label='نوع دسترسی'
            value={fileData?.isPublic ? 'عمومی' : 'خصوصی'}
          />
        </div>
        <div className={styles['info-section__card']}>
          <SidebarItem
            label='تاریخ ایجاد'
            value={moment(fileData?.created).format('jYYYY/jMM/jDD HH:mm')}
          />
          <SidebarItem
            label='تاریخ آخرین ویرایش'
            value={moment(fileData?.updated).format('jYYYY/jMM/jDD HH:mm')}
          />
        </div>

        <CheckPermissions
          permissions={['details']}
          showMessage
          myStyle={{ height: '100px' }}
        >
          {renderChangeLog(fileData?.metaData?.changeLog)}
        </CheckPermissions>
      </div>
    );
  };

  return (
    <div className={styles['preview-modal-overlay']} onClick={handleClose}>
      {/* Sidebar */}
      {currentSlide && fileData && renderPreview(currentSlide)}
      {/* Modal */}
      <div
        className={styles['preview-modal-content']}
        style={{ paddingRight: menuOffset }}
        onClick={(e) => e.stopPropagation()}
      >
        {currentSlide && renderSlide(currentSlide)}

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              className={`${styles['nav-button']} ${styles['nav-button-left']}`}
              onClick={() => {
                setCurrentSlideIndex((prev) =>
                  prev < slides.length - 1 ? prev + 1 : 0
                );
              }}
            >
              {`‹`}
            </button>
            <button
              className={`${styles['nav-button']} ${styles['nav-button-right']}`}
              onClick={() => {
                setCurrentSlideIndex((prev) =>
                  prev > 0 ? prev - 1 : slides.length - 1
                );
              }}
            >
              {`›`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
