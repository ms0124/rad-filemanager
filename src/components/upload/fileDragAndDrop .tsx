import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useRef,
  useMemo
} from 'react';
import { toast } from 'react-toastify';
import {
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Modal,
  ModalBody,
  Alert,
  Input,
  Label
} from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUploadAlt,
  faTimes,
  faChevronDown,
  faChevronUp,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-regular-svg-icons';

import { upload } from '../../config/api';
import { Context } from '../../store';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getHeader } from '../../config/hooks';
import { getBs } from '../../utils/index';
import { IconTick, IconTimes, IconUpload } from '../../utils/icons';
import { audioQualities, videoQualities } from './upload.constants';

const Checkbox = ({ name, index, checked, onClick }) => {
  return (
    <>
      <Input
        id={name + index}
        type='checkbox'
        onClick={onClick}
        checked={checked}
      />
      <Label
        check
        for={name + index}
        className={styles['stream__checkboxlabel']}
        role='button'
      >
        {name}
      </Label>
    </>
  );
};

interface Props {
  modal: { upload: boolean; stream: boolean };
  toggleModal: ({
    upload,
    stream
  }: {
    upload: boolean;
    stream: boolean;
  }) => void;
  uploadComplete: boolean;
  setUploadComplete: (boolean) => void;
  isOpenCollapse: boolean;
  setIsOpenCollapse: (boolean) => void;
  showCollapse: boolean;
  setShowCollapse: (boolean) => void;
  // isStream: boolean;
  // setIsStream: (boolean) => void;
}
interface fileListInterface {
  name: string;
}

const FilesDragAndDrop: FunctionComponent<Props> = ({
  modal,
  toggleModal,
  uploadComplete,
  setUploadComplete,
  isOpenCollapse,
  setIsOpenCollapse,
  showCollapse,
  setShowCollapse
  // isStream,
  // setIsStream
}) => {
  const { currentHash } = useContext(Context);
  const headers = getHeader(false);

  const audioLocal = useMemo(() => {
    const localstorageData = localStorage.getItem('audio');
    const json = localstorageData ? localstorageData : '[]';
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  }, []);

  const videoLocal = useMemo(() => {
    const localstorageData = localStorage.getItem('video');
    const json = localstorageData ? localstorageData : '[]';
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  }, []);

  const [element, setElement] = useState<any | null>(null);
  const [hoverFile, setHoverFile] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  const [audio, setAudio] = useState<string[]>(audioLocal);
  const [video, setVideo] = useState<string[]>(videoLocal);

  const [progress, setProgress] = useState<{}>({});

  const fileListRef = useRef<fileListInterface[]>([]);
  const progressRef = useRef({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllerRef: any = useRef([]);

  useEffect(() => {
    if (audio) localStorage.setItem('audio', JSON.stringify(audio));
  }, [audio]);

  useEffect(() => {
    if (video) localStorage.setItem('video', JSON.stringify(video));
  }, [video]);

  useEffect(() => {
    if (!element) return;
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    return () => {
      if (!element) return;
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('drop', handleDrop);
    };
  }, [element, audio, video]);

  useEffect(() => {
    if (fileListRef.current?.length === 0 || Object.keys(progress).length === 0)
      setShowCollapse(false);
  }, [fileListRef.current, progress]);

  const onUpload = (file) => {
    if (!isOpenCollapse) setIsOpenCollapse(true);
    if (!showCollapse) setShowCollapse(true);

    let formData = new FormData();
    setProgress((prevProgress) => ({
      ...prevProgress,
      [file.name]: { percent: 0, hasError: false, showRemoveButton: true }
    }));
    fileListRef.current = [...fileListRef.current, file];
    progressRef.current = { ...progressRef.current, [file.name]: 0 };

    formData.append('file', file);
    formData.append('folderHash', currentHash);
    formData.append('isPublic', 'true');
    if ((audio.length > 0 || video.length > 0) && modal.stream) {
      formData.append('streamNeeded', 'true');

      let data: string[] = [];
      if (file.type?.endsWith('mpeg')) {
        data = audio;
      } else if (file.type?.endsWith('mp4')) {
        data = video;
      }
      if (data)
        for (let quality of data) {
          formData.append('qualities[]', quality);
        }
    }

    const controller = new AbortController();
    controllerRef.current.push(controller);
    upload(
      formData,
      false,
      {
        onUploadProgress: (e) => onUploadProgress(e, file),
        signal: controller.signal
      },
      headers
    )
      .then((res) => {
        const { hasError } = res.data;
        // if progress is 100 percent or more progress is complete.
        const progressComplete = Object.values(progressRef.current).every(
          (item: number) => item >= 100
        );
        if (hasError)
          setProgress((prev) => ({
            ...prev,
            [file.name]: { ...prev[file.name], hasError: true }
          }));
        if (progressComplete) {
          // for call file list again
          setUploadComplete(true);
          // reset of my parameters
          // setFileList([]);
          // setProgress({});
        }
      })
      .finally(() => {
        // setIsUpload(false);
      });
    // close modal after all
    if (modal.upload) toggleModal({ upload: false, stream: false });
  };
  const onUploadProgress = (progressEvent, file) => {
    const { loaded, total } = progressEvent;

    let progressPercent = (100 * loaded) / total;
    setProgress((prevProgress) => ({
      ...prevProgress,
      [file.name]: {
        percent: parseInt(progressPercent.toFixed()),
        hasError: false,
        showRemoveButton: true
      }
    }));
    progressRef.current = {
      ...progressRef.current,
      [file.name]: parseInt(progressPercent.toFixed())
    };
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hoverFile) setHoverFile(true);
  };
  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hoverFile) setHoverFile(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    setHoverFile(false);
    setUploadComplete(false);

    const files = e.dataTransfer.files;
    // prevent to drop files and folder with size == 0
    if (files && files.length > 0) {
      let breakFunction = false;
      for (let file of files) {
        if (file?.size <= 0) {
          breakFunction = true;
        }
      }
      if (breakFunction) {
        toast.error('شما نمی توانید پوشه یا فایل های با اندازه 0 آپلود کنید');
        return;
      }
    }

    if (files && files.length) {
      for (let file of files) {
        onUpload(file);
      }
    }
  };

  const handleOnChangesInputFiles = (event) => {
    const files = event.target.files;
    setUploadComplete(false);
    if (files && files.length) {
      for (let file of files) {
        onUpload(file);
      }
    }
  };

  const handleToggleShowCollapse = () => {
    setShowCollapse((prevShowCollapse) => !prevShowCollapse);
    let newProgress = { ...progress };
    Object.keys(progress).forEach((name) => {
      if (progress[name].percent >= 100 && progress[name].hasError === false) {
        delete newProgress[name];
      }
    });
    setProgress(newProgress);
  };

  const handleToggleIsOpenCollapse = () =>
    setIsOpenCollapse((prevIsOpenCollapse) => !prevIsOpenCollapse);

  const removeAbort = (name, index) => {
    setTimeout(() => {
      const newFileList = Object.values(fileListRef.current).filter(
        (x) => x.name !== name
      );
      const progressKey = Object.keys(progress).find((x) => x == name);
      if (progressKey) delete progress[progressKey];

      // setFileList(newFileList);
      fileListRef.current = newFileList;
      setProgress(progress);
    }, 3000);
    if (progress[name]) {
      setProgress((prevProgress) => ({
        ...prevProgress,
        [name]: { ...prevProgress[name], showRemoveButton: false }
      }));
    }
    controllerRef.current[index].abort();
  };

  const handleClickCheckbox = (e, item, type) => {
    const { checked } = e.target;
    if (checked && type === 'audio') {
      setAudio((prev) => [...prev, item]);
    } else if (checked && type === 'video') {
      setVideo((prev) => [...prev, item]);
    } else if (!checked && type === 'audio') {
      const filtredQualities = audio.filter((i) => i !== item);
      setAudio(filtredQualities);
    } else if (!checked && type === 'video') {
      const filtredQualities = video.filter((i) => i !== item);
      setVideo(filtredQualities);
    }
  };

  return (
    <>
      <Modal
        innerRef={isUpload ? undefined : setElement}
        cssModule={getBs()}
        isOpen={modal.upload}
        toggle={() => {
          toggleModal({ upload: false, stream: false });
        }}
        contentClassName={isUpload ? styles['upload-toast'] : styles['upload']}
        className={styles['modal-container']}
        zIndex={99991}
      >
        {
          <ModalBody cssModule={getBs()}>
            {modal.stream && (
              <>
                <div className={styles['stream']}>
                  <div className={styles['stream__title']}>
                    <span>کیفیت فایل صوتی</span>
                    <span className={styles['stream__subTitle']}>(mp3)</span>
                  </div>
                  {audioQualities.map((x, index) => (
                    <Checkbox
                      checked={audio.find((y) => y === x) ? 'checked' : ''}
                      name={x}
                      index={index}
                      onClick={(e) => handleClickCheckbox(e, x, 'audio')}
                    />
                  ))}
                  <div
                    className={classnames(
                      styles['stream__title'],
                      utilStyles['mt-2']
                    )}
                  >
                    <span>کیفیت فایل تصویری</span>
                    <span className={styles['stream__subTitle']}>(mp4)</span>
                  </div>
                  {videoQualities.map((x, index) => (
                    <Checkbox
                      checked={video.find((y) => y === x) ? 'checked' : ''}
                      name={x}
                      index={index}
                      onClick={(e) => handleClickCheckbox(e, x, 'video')}
                    />
                  ))}
                </div>
                <div className={styles['guide']}>
                  <FontAwesomeIcon
                    className={styles['guide__icon']}
                    icon={faExclamationTriangle}
                  />
                  <span className={styles['guide__title']}>
                    استریم فقط فایل‌های mp3 , mp4 مجاز است.
                  </span>
                </div>
              </>
            )}

            <div
              onClick={() => {
                inputRef.current?.click();
              }}
              className={styles['drag-here']}
              style={{
                backgroundColor: hoverFile
                  ? 'rgba(97, 132, 255, 0.2)'
                  : 'rgba(255, 255, 255, 1)'
              }}
            >
              <input
                ref={inputRef}
                type='file'
                multiple
                style={{ display: 'none', width: '100%', height: '100%' }}
                onChange={handleOnChangesInputFiles}
              />
              <IconUpload
                colorGray
                size={'100px'}
                style={{ marginTop: '30px' }}
              />
              <h5
                className={classnames(utilStyles['mt-5'], utilStyles['mb-4'])}
              >
                فایل مورد نظر را در اینجا رها کنید.
              </h5>
            </div>
          </ModalBody>
        }
      </Modal>
      {showCollapse && (
        <Card cssModule={getBs()} className={styles['upload-notification']}>
          <CardHeader
            cssModule={getBs()}
            className={styles['upload-notification__header']}
          >
            <span id='test' className={styles['upload-notification__title']}>
              در حال بارگذاری {Object.keys(fileListRef.current).length} فایل
            </span>
            {isOpenCollapse ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className={styles['upload-notification__chevron']}
                role='button'
                onClick={handleToggleIsOpenCollapse}
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className={styles['upload-notification__chevron']}
                role='button'
                onClick={handleToggleIsOpenCollapse}
              />
            )}
            <FontAwesomeIcon
              icon={faTimes}
              className={styles['upload-notification__times']}
              onClick={handleToggleShowCollapse}
              role='button'
            />
          </CardHeader>
          <Collapse
            cssModule={getBs()}
            isOpen={isOpenCollapse}
            className={styles['upload-notification__collapse']}
          >
            <div className={styles['upload-notification__divider']}></div>
            {fileListRef.current &&
              Object.values(fileListRef.current).map((item, index) => {
                return (
                  <Alert
                    color={
                      progress[item.name].hasError
                        ? 'danger'
                        : progress[item.name].percent >= 100
                        ? 'success'
                        : ''
                    }
                    className={`${utilStyles['d-flex']} ${utilStyles['justify-content-between']} ${styles['upload-notification__alert']}`}
                  >
                    <div className={classnames(utilStyles['d-flex'])}>
                      {progress[item.name].hasError ? (
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          style={{ color: '#e4a400', height: '22px' }}
                        />
                      ) : progress[item.name].percent >= 100 ? (
                        <IconTick style={{ width: '24px' }} />
                      ) : (
                        <div style={{ width: 25, height: 25 }}>
                          <CircularProgressbar
                            value={progress[item.name].percent}
                            styles={buildStyles({
                              textSize: '30px',
                              pathColor: '#000000',
                              textColor: '#000000'
                            })}
                            text={`${progress[item.name].percent} %`}
                          />
                        </div>
                      )}

                      <FontAwesomeIcon
                        icon={faFile}
                        style={{
                          paddingRight: '8px',
                          height: '22px',
                          color: '#737373'
                        }}
                      />
                      <span
                        style={{
                          paddingRight: '8px',
                          color: '#737373',
                          textAlign: 'right'
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className={styles['upload-toast__icon-wrapper']}>
                      {progress[item.name].showRemoveButton && (
                        <span
                          role='button'
                          onClick={(_) => removeAbort(item.name, index)}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{ height: '14px' }}
                          />
                        </span>
                      )}
                    </div>
                  </Alert>
                );
              })}
          </Collapse>
        </Card>
      )}
    </>
  );
};

export default FilesDragAndDrop;
