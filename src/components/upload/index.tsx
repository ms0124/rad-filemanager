import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import FileDragAndDrop from './fileDragAndDrop ';
import CheckPermissions from '../../components/CheckPermissions/index';
import { getBs } from '../../utils/index';
import { IconUpload } from "../../utils/icons"

const Upload = () => {
  const [modal, setModal] = useState(false);

  const handleModalToggle = () => {
    setModal((prev) => !prev);
  };

  return (
    <React.Fragment>
      <CheckPermissions permissions={['upload', 'upload_image']}>
        <Button
          cssModule={getBs()}
          className={`${styles['btn-upload']} ${utilStyles['my-auto']}`}
          onClick={handleModalToggle}
        >
          <IconUpload  />
          {/* <FontAwesomeIcon icon={faCloudUploadAlt} /> */}
         <span> بارگذاری</span>
        </Button>
      </CheckPermissions>
      {modal && (
        <FileDragAndDrop modal={modal} toggleModal={handleModalToggle} />
      )}
    </React.Fragment>
  );
};

export default Upload;
