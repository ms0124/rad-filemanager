import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';

import { Context } from '../../store';
import FileDragAndDrop from './fileDragAndDrop ';
import CheckPermissions from '../../components/CheckPermissions/index';
import { getBs } from '../../utils/index';
import { IconUpload } from "../../utils/icons";
import { queryClient } from '../../config/config';

const Upload = () => {
  const [modal, setModal] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false); 
  const [showCollapse, setShowCollapse] = useState(false); 
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  const { currentHash } = useContext(Context);

  useEffect(() => {
    if (uploadComplete) {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', currentHash]
      });
      setUploadComplete(false);
    }
  }, [uploadComplete])

  const handleModalToggle = (isOpen) => {
    setModal(isOpen);
  };

  return (
    <React.Fragment>
      <CheckPermissions permissions={['upload', 'upload_image']}>
        <Button
          tag={'a'}
          cssModule={getBs()}
          className={`${styles['btn-upload']} ${utilStyles['my-auto']}`}
          onClick={(event)=> handleModalToggle(true)}
        >
          <IconUpload size='18px' />
         <span> بارگذاری</span>
        </Button>
      </CheckPermissions>
      <FileDragAndDrop
        uploadComplete={uploadComplete}
        setUploadComplete={setUploadComplete}
        modal={modal}
        toggleModal={handleModalToggle}
        isOpenCollapse={isOpenCollapse} setIsOpenCollapse={setIsOpenCollapse} showCollapse={showCollapse} setShowCollapse={setShowCollapse} />
    </React.Fragment>
  );
};

export default Upload;
