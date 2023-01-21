import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext
} from 'react';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { upload } from '../../config/api';
import { Context } from '../../store';

import { queryClient } from '../../config/config';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  modal: boolean;
  toggleModal: () => void;
}

interface fileListInterface {
  name: string;
}

const FilesDragAndDrop: FunctionComponent<Props> = ({ modal, toggleModal }) => {
  const { currentHash } = useContext(Context);

  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [hoverFile, setHoverFile] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<fileListInterface[]>([]);
  const [progress, setProgress] = useState<number>(0);

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

  const onUpload = (files) => {
    let formData = new FormData();

    formData.append('file', files[0]);
    formData.append('folderHash', currentHash);
    const onUploadProgress = (progressEvent) => {
      const { loaded, total, progress } = progressEvent;

      let progressPercent = (100 * loaded) / total;
      setProgress(parseInt(progressPercent.toFixed()));
      if (progress == 1) {
        setTimeout(() => {
          setFileList([]);
          setProgress(0);
          toggleModal();
        }, 2500);
      }
    };
    upload(formData, false, onUploadProgress).then(() => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', currentHash]
      });
    });
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
      onUpload(files);
      setIsUpload(true);
      setFileList(files);
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
                        value={progress}
                        styles={buildStyles({
                          textSize: '30px',
                          pathColor: '#000000',
                          textColor: '#000000'
                        })}
                        text={`${progress} %`}
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
            className='drag-here'
            style={{
              backgroundColor: hoverFile ? 'rgba(97, 132, 255, 0.2)' : ''
            }}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} size='8x' />
            <div>فایل مورد نظر را در اینجا رها کنید.</div>
          </ModalBody>
        </div>
      )}
    </Modal>
  );
};

export default FilesDragAndDrop;
