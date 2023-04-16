import './style.scss';

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import FileDragAndDrop from './fileDragAndDrop ';
import CheckPermissions from '../../components/CheckPermissions/index';

const Upload = () => {
  const [modal, setModal] = useState(false);

  const handleModalToggle = () => {
    setModal((prev) => !prev);
  };

  return (
    <React.Fragment>
      <CheckPermissions permissions={['drives_upload', 'drives_upload_image']}>
        <Button className='btn-upload mb-2' onClick={handleModalToggle}>
          <FontAwesomeIcon icon={faCloudUploadAlt} /> بارگذاری
        </Button>
      </CheckPermissions>
      {modal && (
        <FileDragAndDrop modal={modal} toggleModal={handleModalToggle} />
      )}
    </React.Fragment>
  );
};

export default Upload;
