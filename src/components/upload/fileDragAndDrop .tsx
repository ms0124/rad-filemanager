import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useRef
} from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import classnames from "classnames"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { upload } from '../../config/api';
import { Context } from '../../store';

import { queryClient } from '../../config/config';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getHeader } from '../../config/hooks';
import { getBs } from '../../utils/index';
import { IconTick, IconTimes, IconUpload } from '../../utils/icons';

interface Props {
  modal: boolean;
  toggleModal: (boolean) => void;
}

interface fileListInterface {
  name: string;
}

const FilesDragAndDrop: FunctionComponent<Props> = ({ modal, toggleModal }) => {
  const { currentHash } = useContext(Context);
  const headers = getHeader(false);

  const [element, setElement] = useState<any | null>(null);
  const [hoverFile, setHoverFile] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<fileListInterface[]>([]);
  const [progress, setProgress] = useState<{}>({});
  const progressRef = useRef({});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllerRef: any = useRef([]);

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
  }, [element]);

  const onUpload = (file) => {
    let formData = new FormData();
    setFileList((prevFileList) => [...prevFileList, file]);
    setProgress((prevProgress) => ({ ...prevProgress, [file.name]: 0 }));
    progressRef.current = { ...progressRef.current, [file.name]: 0 };

    formData.append('file', file);
    formData.append('folderHash', currentHash);
    formData.append('isPublic', 'true');
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
        // if progress is 100 percent or more progress is complete.
        const progressComplete = Object.values(progressRef.current).every(
          (item: number) => item >= 100
        );
        if (progressComplete) {
          // get list of file again
          queryClient.refetchQueries({
            queryKey: ['folderContentChildren', { hash: currentHash, headers }]
          });
          // reset of my parameters
          setFileList([]);
          setProgress({});
          if (modal) toggleModal(false);
        }
      })
      .finally(() => {
        queryClient.refetchQueries({
          queryKey: ['folderContentChildren', currentHash]
        });
      });
  };
  const onUploadProgress = (progressEvent, file) => {
    const { loaded, total, progress } = progressEvent;

    let progressPercent = (100 * loaded) / total;
    setProgress((prevProgress) => ({
      ...prevProgress,
      [file.name]: parseInt(progressPercent.toFixed())
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
    const { files } = e.dataTransfer;
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

    setHoverFile(false);
    if (files && files.length) {
      setIsUpload(true);

      for (let file of files) {
        onUpload(file);
      }
    }
  };

  const handleOnChangesInputFiles = (event) => {
    const files = event.target.files;
    if (files && files.length) {
      setIsUpload(true);

      for (let file of files) {
        onUpload(file);
      }
    }
  };

  return (
    <Modal
      innerRef={isUpload ? setElement : undefined}
      cssModule={getBs()}
      isOpen={modal}
      toggle={() => toggleModal(false)}
      contentClassName={isUpload ? styles['upload-toast'] : styles['upload']}
      className={styles['modal-container']}
      zIndex={99991}
    >
      {isUpload ? (
        <React.Fragment>
          <ModalHeader
            cssModule={getBs()}
            className={
              isUpload ? styles['upload-toast__header'] + '   header ' : ''
            }
          >
            <span>بارگذاری</span>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => toggleModal(false)}
              className={styles['icon-times']}
            />
          </ModalHeader>
          <ModalBody cssModule={getBs()}>
            {fileList &&
              Object.values(fileList).map((item, index) => {
                return (
                  <div
                    className={`${utilStyles['d-flex']} ${utilStyles['justify-content-between']}`}
                  >
                    <span>{item.name}</span>
                    {progress[item.name] >= 100 ? (
                      <IconTick style={{ width: '24px' }} />
                    ) : (
                      <div className={styles['upload-toast__icon-wrapper']}>
                        <div style={{ width: 25, height: 25 }}>
                          <CircularProgressbar
                            value={progress[item.name]}
                            styles={buildStyles({
                              textSize: '30px',
                              pathColor: '#000000',
                              textColor: '#000000'
                            })}
                            text={`${progress[item.name]} %`}
                          />
                        </div>
                        <span
                          role='button'
                          onClick={() => {
                            controllerRef.current[index].abort();
                          }}
                        >
                          <IconTimes style={{ width: '24px' }} />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </ModalBody>
        </React.Fragment>
      ) : (
          <ModalBody
            cssModule={getBs()}
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
            <IconUpload colorGray size={'100px'} style={{marginTop: '30px'}} />
            <h5 className={classnames(utilStyles['mt-5'], utilStyles['mb-4'])}>فایل مورد نظر را در اینجا رها کنید.</h5>
          </ModalBody>
      )}
    </Modal>
  );
};

export default FilesDragAndDrop;
