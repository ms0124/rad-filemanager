import React, { FunctionComponent, useEffect, useState } from 'react';

import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

import { uploadFile } from "../../config/api";

interface Props {
  modal: boolean;
  toggleModal: () => void;
}

interface fileListInterface {
  name: string;
}

const FilesDragAndDrop: FunctionComponent<Props> = ({ modal, toggleModal }) => {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [hoverFile, setHoverFile] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<fileListInterface[]>([]);

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
    
    uploadFile({file: files})
  }
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
                return <div>{item.name}</div>;
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
