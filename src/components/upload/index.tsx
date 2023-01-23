import './style.scss';

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import FileDragAndDrop from './fileDragAndDrop ';

const Upload = () => {
  const [modal, setModal] = useState(false);

  const handleModalToggle = () => {
    setModal((prev) => !prev);
  };

  return (
    <React.Fragment>
      <Button className='btn-upload mb-2' onClick={handleModalToggle}>
        <FontAwesomeIcon icon={faCloudUploadAlt} /> بارگذاری
      </Button>
      {modal && (
        <FileDragAndDrop
          modal={modal}
          toggleModal={handleModalToggle}
        />
      )}
    </React.Fragment>
  );
};

export default Upload;
