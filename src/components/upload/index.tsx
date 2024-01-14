import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Context } from '../../store';
import FileDragAndDrop from './fileDragAndDrop ';
import CheckPermissions from '../../components/CheckPermissions/index';
import { getBs } from '../../utils/index';
import { IconStream, IconUpload } from '../../utils/icons';
import { queryClient } from '../../config/config';

const Upload = () => {
  const [modal, setModal] = useState<{ upload: boolean; stream: boolean }>({
    upload: false,
    stream: false
  });
  // const [isStream, setIsStream] = useState(false);
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
  }, [uploadComplete]);

  const handleModalToggle = ({
    upload,
    stream
  }: {
    upload: boolean;
    stream: boolean;
  }) => {
    setModal({ upload, stream });
  };

  return (
    <React.Fragment>
      <CheckPermissions permissions={['upload', 'upload_image']}>
        <UncontrolledDropdown cssModule={getBs()}>
          <Button
            tag={'a'}
            cssModule={getBs()}
            className={`${styles['btn-upload']} ${utilStyles['my-auto']}`}
            onClick={(event) =>
              handleModalToggle({ upload: true, stream: false })
            }
          >
            <IconUpload size='18px' />
            <span> بارگذاری</span>
            <DropdownToggle
              tag={'a'}
              style={{
                background: 'transparent',
                border: 'none',
                paddingRight: '5px'
              }}
              cssModule={getBs()}
              onClick={(e) => e.stopPropagation()}
            >
              <FontAwesomeIcon icon={faChevronDown} style={{ color: '#fff' }} />
            </DropdownToggle>
          </Button>

          <DropdownMenu className={styles['dropdown-menu']} cssModule={getBs()}>
            <DropdownItem
              cssModule={getBs()}
              style={{ paddingLeft: 5, paddingRight: 5 }}
              onClick={() => handleModalToggle({ upload: true, stream: true })}
            >
              <IconStream />
              <span style={{ marginRight: '12px', fontSize: '14px' }}>
                بارگذاری استریم
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CheckPermissions>
      <FileDragAndDrop
        uploadComplete={uploadComplete}
        setUploadComplete={setUploadComplete}
        modal={modal}
        // isStream={modal.stream}
        // setIsStream={setIsStream}
        toggleModal={handleModalToggle}
        isOpenCollapse={isOpenCollapse}
        setIsOpenCollapse={setIsOpenCollapse}
        showCollapse={showCollapse}
        setShowCollapse={setShowCollapse}
      />
    </React.Fragment>
  );
};

export default Upload;
