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
import moment from 'moment-jalaali';
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
import { useUploadLink, useStreamPrepare } from '../../config/hooks';
import { objectToQueryString } from '../../utils/index';

import DefaultThumbnail from '../StateColumnList/defaultThumbnail/index';

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

const Radio = ({ name, index, checked, onClick }) => {
  return (
    <>
      <Input id={index} type='radio' onClick={onClick} checked={checked} />
      <Label
        check
        for={index}
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

interface ProgressItemType {
  percent: number;
  hasError: boolean;
  showRemoveButton: boolean;
  completeSuccess: boolean;
  message?: string;
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
  // setIsStream
}) => {
  const { currentHash, validExtension, isSandbox } = useContext(Context);

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

  const [progress, setProgress] = useState<Record<string, ProgressItemType>>(
    {}
  );

  const [isPublic, setIsPublic] = useState<boolean>(false);

  const fileListRef = useRef<fileListInterface[]>([]);
  const uploadHashRef = useRef<string>('');
  const progressRef = useRef<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllerRef = useRef<Record<string, AbortController>>({});
  const streamPrepare = useStreamPrepare({});
  const { data, refetch } = useUploadLink(
    objectToQueryString({
      size: 0,
      expiration: moment().add(1, 'hour').format('YYYY/MM/DD HH:mm:00'),
      destination: currentHash,
      isPublic: isPublic
    })
  );

  const disabledUploadStream = useMemo(() => {
    return modal.stream && audio.length === 0 && video.length === 0
      ? true
      : false;
  }, [audio, video, modal.stream]);

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
  }, [element, audio, video, isPublic]);

  useEffect(() => {
    if (fileListRef.current?.length === 0 || Object.keys(progress).length === 0)
      setShowCollapse(false);
  }, [fileListRef.current, progress]);

  const onUpload = (file, index, uploadHash) => {
    if (!isOpenCollapse) setIsOpenCollapse(true);
    if (!showCollapse) setShowCollapse(true);

    let formData = new FormData();
    setProgress((prevProgress) => ({
      ...prevProgress,
      [`${file.name}_${index}`]: {
        percent: 0,
        hasError: false,
        showRemoveButton: true,
        completeSuccess: false
      }
    }));
    fileListRef.current = [...fileListRef.current, file];
    progressRef.current = { ...progressRef.current, [file.name]: 0 };

    let qualities: string[] = [];

    formData.append('file', file);
    if (modal?.stream) formData.append('folderHash', currentHash);
    if (modal?.stream) formData.append('isPublic', `${isPublic}`);
    if ((audio.length > 0 || video.length > 0) && modal.stream) {
      formData.append('streamNeeded', 'true');

      if (file.type?.endsWith('mpeg')) {
        qualities = audio;
      } else if (file.type?.endsWith('mp4')) {
        qualities = video;
      }
      // if (data)
      // for (let quality of data) {
      // formData.append('qualities[]', quality);
      // }
    }

    const controller = new AbortController();
    controllerRef.current = {
      ...controllerRef.current,
      [`${file.name}_${index}`]: controller
    };
    upload(
      {
        isSandbox,
        uploadHash: uploadHash,
        formData,
        stream: modal?.stream
      },
      {
        onUploadProgress: (e) => onUploadProgress(e, file, index),
        signal: controller.signal
      },
      headers
    )
      .then((res) => {
        const {
          hasError,
          message,
          result: { hash }
        } = res.data;

        // if progress is 100 percent or more progress is complete.
        const progressComplete = Object.values(progressRef.current).every(
          (item: number) => item >= 100
        );

        if (hasError) {
          setProgress((prev) => ({
            ...prev,
            [`${file.name}_${index}`]: {
              ...prev[`${file.name}_${index}`],
              hasError: true,
              message: message.join('/\n'),
              completeSuccess: false
            }
          }));
        } else {
          if (modal.stream) streamPrepare.mutateAsync({ hash, qualities });
          setProgress((prev) => ({
            ...prev,
            [`${file.name}_${index}`]: {
              ...prev[`${file.name}_${index}`],
              hasError: false,
              message: '',
              completeSuccess: true
            }
          }));
        }
        if (progressComplete) {
          // for call file list again
          setUploadComplete(true);
          // reset of my parameters
          // setFileList([]);
          // setProgress({});
        }
      })
      .catch((res) => {
        const { message } = res.response?.data;
        // this message come from pod
        if (message)
          setProgress((prev) => ({
            ...prev,
            [`${file.name}_${index}`]: {
              ...prev[`${file.name}_${index}`],
              hasError: true,
              message: message,
              completeSuccess: false
            }
          }));
      })
      .finally(() => {
        // setIsUpload(false);
      });
    // close modal after all
    if (modal.upload) toggleModal({ upload: false, stream: false });
  };
  const onUploadProgress = (progressEvent, file, index) => {
    const { loaded, total } = progressEvent;

    let progressPercent = (100 * loaded) / total;
    setProgress((prevProgress) => ({
      ...prevProgress,
      [`${file.name}_${index}`]: {
        percent: parseInt(progressPercent.toFixed()),
        hasError: false,
        showRemoveButton: true,
        completeSuccess: false
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
    if (disabledUploadStream) return;
    if (!hoverFile) setHoverFile(true);
  };
  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabledUploadStream) return;
    if (!hoverFile) setHoverFile(false);
  };
  const breakUpload = (files) => {
    let breakFunction = false;
    let breakFunctionForStreamExtention = false;
    let breakFunctionForExtention = false;
    for (let file of files) {
      if (
        !validExtension.find((item) =>
          file?.name?.toLocaleLowerCase()?.endsWith(item)
        )
      ) {
        breakFunctionForExtention = true;
        break;
      }
      if (modal.stream) {
        const arrStreamType: string[] = [];
        if (audio.length > 0) {
          arrStreamType.push('mpeg');
        }
        if (video.length > 0) {
          arrStreamType.push('mp4');
        }
        if (!arrStreamType.find((item) => file?.type.endsWith(item))) {
          breakFunctionForStreamExtention = true;
          break;
        }
      }
      if (file?.size <= 0) {
        breakFunction = true;
        break;
      }
    }
    if (breakFunctionForExtention) {
      toast.error('فایل مجاز به آپلود نمیباشد');
      return true;
    }
    if (breakFunctionForStreamExtention) {
      toast.error('فایل انتخاب شده یا کیفیت انتخاب شده درست نیست');
      return true;
    }

    if (breakFunction) {
      toast.error('شما نمی توانید پوشه یا فایل های با اندازه 0 آپلود کنید');
      return true;
    }
    return false;
  };
  const handleDrop = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    // if (!modal.stream) {
    const { data } = await refetch();
    const uploadHash = data?.result[0]?.uploadHash;
    uploadHashRef.current = uploadHash;

    // }

    if (disabledUploadStream) return;
    setHoverFile(false);
    setUploadComplete(false);

    if (files && files.length > 0) {
      if (breakUpload(files)) return;
    }
    if (files && files.length) {
      let index = fileListRef.current.length;
      for (let file of files) {
        onUpload(file, index, uploadHash);
        index++;
      }
    }
  };

  const handleOnChangesInputFiles = async (e) => {
    const files = [...e.target.files];
    // if (!modal.stream) {
    const { data } = await refetch();
    const uploadHash = data?.result[0]?.uploadHash;
    uploadHashRef.current = uploadHash;
    // }

    setUploadComplete(false);
    if (files && files.length > 0) {
      if (breakUpload(files)) return;
    }
    let index = fileListRef.current.length;

    if (files && files.length) {
      for (let file of files) {
        onUpload(file, index, uploadHash);
        index++;
      }
    }
  };

  const handleToggleShowCollapse = () => {
    setShowCollapse((prevShowCollapse) => !prevShowCollapse);
    let newProgress = { ...progress };
    let newFileList = fileListRef.current;

    Object.keys(progress).forEach((name) => {
      if (progress[name].percent >= 100) {
        delete newProgress[name];
        // just work for 0-10 **** just work for 10 file upload
        const realName = name.slice(0, -2);
        newFileList = Object.values(newFileList).filter(
          (x, index) => x.name !== realName
        );
      }
    });
    fileListRef.current = newFileList;
    setProgress(newProgress);
  };

  const handleToggleIsOpenCollapse = () =>
    setIsOpenCollapse((prevIsOpenCollapse) => !prevIsOpenCollapse);

  const removeAbort = (name, index) => {
    setTimeout(() => {
      const newFileList = Object.values(fileListRef.current).filter(
        (item, currentIndex) => {
          if (!progress[`${item.name}_${currentIndex}`]) {
            const progresskey = Object.keys(progress).find((x) =>
              x.startsWith(item.name)
            );
            const splitedkey = progresskey?.split('_');
            const numberIndex = splitedkey
              ? parseInt(splitedkey[splitedkey?.length - 1])
              : 1;
            currentIndex = numberIndex;
          }

          return `${item.name}_${currentIndex}` !== `${name}_${index}`;
        }
      );

      const progressKey = Object.keys(progress).find(
        (x) => x == `${name}_${index}`
      );
      const tmpProgress = { ...progress };
      if (progressKey) delete tmpProgress[progressKey];

      fileListRef.current = newFileList;

      setProgress(tmpProgress);
    }, 3000);
    if (progress[`${name}_${index}`]) {
      setProgress((prevProgress) => ({
        ...prevProgress,
        [`${name}_${index}`]: {
          ...prevProgress[`${name}_${index}`],
          showRemoveButton: false
        }
      }));
    }

    controllerRef.current[`${name}_${index}`].abort();
    delete controllerRef.current[`${name}_${index}`];
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
  const clickHandlerRadio = () => {
    setIsPublic((prevIsPublic) => !prevIsPublic);
  };

  const getExtension = (item) => {
    const result = item.name?.split('.');
    return result[result.length - 1] || '';
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
            <>
              {modal.stream && (
                <div
                  className={classnames(styles['guide'], utilStyles['mb-3'])}
                >
                  <FontAwesomeIcon
                    className={styles['guide__icon']}
                    icon={faExclamationTriangle}
                  />
                  <span className={styles['guide__title']}>
                    حداقل یکی از کیفیت های استریم را انتخاب کنید.
                  </span>
                </div>
              )}
              <div className={styles['stream']}>
                {modal.stream && (
                  <>
                    <div className={styles['stream__title']}>
                      <span> کیفیت فایل صوتی</span>
                      <span className={styles['stream__subTitle']}>
                        {' '}
                        (mp3){' '}
                      </span>
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
                      <span> کیفیت فایل تصویری</span>
                      <span className={styles['stream__subTitle']}>
                        {' '}
                        (mp4){' '}
                      </span>
                    </div>
                    {videoQualities.map((x, index) => (
                      <Checkbox
                        checked={video.find((y) => y === x) ? 'checked' : ''}
                        name={x}
                        index={index}
                        onClick={(e) => handleClickCheckbox(e, x, 'video')}
                      />
                    ))}
                  </>
                )}
                <div className={styles['stream__title']}>
                  <span>نوع دسترسی</span>
                </div>

                <Radio
                  onClick={clickHandlerRadio}
                  name={'عمومی'}
                  index={0}
                  checked={isPublic}
                  key={'x1'}
                />
                <Radio
                  onClick={clickHandlerRadio}
                  name={'خصوصی'}
                  index={1}
                  checked={!isPublic}
                  key={'x2'}
                />
              </div>
              {modal.stream && (
                <div className={styles['guide']}>
                  <FontAwesomeIcon
                    className={styles['guide__icon']}
                    icon={faExclamationTriangle}
                  />
                  <span className={styles['guide__title']}>
                    امکان استریم فقط برای فایل‌های از نوع mp3 و mp4 مجاز است.
                  </span>
                </div>
              )}
            </>
            <div
              onClick={() => {
                if (disabledUploadStream) return;
                inputRef.current?.click();
              }}
              className={styles['drag-here']}
              style={{
                opacity: disabledUploadStream ? 0.3 : 1,
                backgroundColor: hoverFile
                  ? 'rgba(97, 132, 255, 0.2)'
                  : 'rgba(255, 255, 255, 1)'
              }}
            >
              <input
                ref={inputRef}
                type='file'
                value={inputRef.current?.value}
                accept={modal.stream ? '.mp3,.mp4' : ''}
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
                if (!progress[`${item.name}_${index}`]) {
                  const progresskey = Object.keys(progress).find((x) =>
                    x.startsWith(item.name)
                  );
                  const splitedkey = progresskey?.split('_');
                  const numberIndex = splitedkey
                    ? parseInt(splitedkey[splitedkey?.length - 1])
                    : 1;
                  index = numberIndex;
                }
                return (
                  <Alert
                    color='light'
                    style={{
                      backgroundColor: progress[`${item.name}_${index}`]
                        ?.hasError
                        ? '#FFF0F0'
                        : progress[`${item.name}_${index}`]?.percent >= 100 &&
                          progress[`${item.name}_${index}`]?.completeSuccess
                        ? '#EBF8F2'
                        : '',
                      borderColor: '#f2f2f2'
                    }}
                    className={`${utilStyles['d-flex']} ${utilStyles['justify-content-between']} ${styles['upload-notification__alert']}`}
                  >
                    <div
                      className={classnames(
                        utilStyles['d-flex'],
                        getBs()['align-items-center']
                      )}
                    >
                      {progress[`${item.name}_${index}`]?.hasError ? (
                        <FontAwesomeIcon
                          title={progress[`${item.name}_${index}`]?.message}
                          icon={faExclamationTriangle}
                          style={{ color: '#e4a400', height: '22px' }}
                        />
                      ) : progress[`${item.name}_${index}`]?.percent >= 100 &&
                        progress[`${item.name}_${index}`]?.completeSuccess ? (
                        <IconTick style={{ width: '24px' }} />
                      ) : (
                        <div style={{ width: 25, height: 25 }}>
                          <CircularProgressbar
                            value={progress[`${item.name}_${index}`]?.percent}
                            styles={buildStyles({
                              textSize: '30px',
                              pathColor: '#000000',
                              textColor: '#000000'
                            })}
                            text={`${
                              progress[`${item.name}_${index}`]?.percent
                            } %`}
                          />
                        </div>
                      )}
                      <DefaultThumbnail
                        style={{
                          paddingRight: '8px',
                          height: '22px',
                          color: '#737373'
                        }}
                        size='1x'
                        item={{ extension: getExtension(item) }}
                      />
                      <span
                        style={{
                          paddingRight: '8px',
                          color: '#737373',
                          textAlign: 'right',
                          width: '200px',
                          wordWrap: 'break-word'
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className={styles['upload-toast__icon-wrapper']}>
                      {progress[`${item.name}_${index}`]?.showRemoveButton && (
                        <span
                          role='button'
                          onClick={(_) => removeAbort(item.name, index)}
                        >
                          <FontAwesomeIcon
                            icon={faTimes}
                            style={{
                              height: '14px'
                            }}
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
