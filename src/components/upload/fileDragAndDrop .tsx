import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
  useRef
} from 'react';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { upload } from '../../config/api';
import { Context } from '../../store';

import { queryClient } from '../../config/config';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getHeader } from '../../config/hooks';

interface Props {
  modal: boolean;
  toggleModal: () => void;
}

interface fileListInterface {
  name: string;
}

const FilesDragAndDrop: FunctionComponent<Props> = ({ modal, toggleModal }) => {
  const { currentHash } = useContext(Context);
  const headers = getHeader(false);

  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [hoverFile, setHoverFile] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<fileListInterface[]>([]);
  const [progress, setProgress] = useState<{}>({});
  const progressRef = useRef({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!element) return;
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      if (!element) return;
      element.removeEventListener('dragover', handleDragOver);
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

    upload(formData, false, (e) => onUploadProgress(e, file), headers).then(
      (res) => {
        // if progress is 100 percent or more progress is complete.
        const progressComplete = Object.values(progressRef.current).every(
          (item: number) => item >= 100
        );
        if (progressComplete) {
          // get list of file again
          queryClient.refetchQueries({
            queryKey: ['folderContentChildren', { hash: currentHash , headers }]
          });
          // reset of my parameters
          setFileList([]);
          setProgress({});
          toggleModal();
        }
      }
    );
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

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;

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
      isOpen={modal}
      toggle={toggleModal}
      className={isUpload ? 'modal-container upload-toast' : 'modal-container'}
      centered={true}
    >
      {isUpload ? (
        <React.Fragment>
          <ModalHeader>
            <span>بارگذاری</span>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={toggleModal}
              className='icon-times'
            />
          </ModalHeader>
          <ModalBody>
            {fileList &&
              Object.values(fileList).map((item) => {
                return (
                  <div className='d-flex justify-content-between'>
                    <span>{item.name}</span>
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
                  </div>
                );
              })}
          </ModalBody>
        </React.Fragment>
      ) : (
        <div ref={setElement}>
          <ModalBody
            onClick={() => {
              inputRef.current?.click();
            }}
            className='drag-here'
            style={{
              backgroundColor: hoverFile ? 'rgba(97, 132, 255, 0.2)' : ''
            }}
          >
            <input
              ref={inputRef}
              type='file'
              multiple
              style={{ display: 'none', width: '100%', height: '100%' }}
              onChange={handleOnChangesInputFiles}
            />
            <FontAwesomeIcon icon={faCloudUploadAlt} size='8x' />
            <div>فایل مورد نظر را در اینجا رها کنید.</div>
          </ModalBody>
        </div>
      )}
    </Modal>
  );
};

export default FilesDragAndDrop;
