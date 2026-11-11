import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useState, useEffect, useContext } from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { Context } from '../../store';
import FileDragAndDrop from './fileDragAndDrop ';
import CheckPermissions from '../../components/CheckPermissions/index';
import NewFolderModal from '../../utils/rightClick/Modal';
import { OperationTypes } from '../../config/types';
import { getBs } from '../../utils/index';
import { IconStream, IconUpload, IconFolderPlus } from '../../utils/icons';
import { queryClient } from '../../config/config';
import moment from 'moment-jalaali';

const Upload = () => {
  const [modal, setModal] = useState<{ upload: boolean; stream: boolean }>({
    upload: false,
    stream: false
  });
  // const [isStream, setIsStream] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [showCollapse, setShowCollapse] = useState(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  const { currentHash } = useContext(Context);

  useEffect(() => {
    if (uploadComplete) {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', currentHash]
      });
      setUploadComplete(false);
    }
  }, [uploadComplete]);

  const handleModalToggle = async ({
    upload,
    stream
  }: {
    upload: boolean;
    stream: boolean;
  }) => {
    setModal({ upload, stream });

    // get upload hash
    if (upload || stream) {
      //  const {data} = await refetch();
      //  setUploadHash(data.result[0]?.uploadHash);
    }
  };

  const toggleNewFolder = () => setIsNewFolderOpen((prev) => !prev);

  return (
    <React.Fragment>
      <CheckPermissions
        permissions={['stream_offline_prepare', 'upload_link', 'folder_create']}
      >
        <UncontrolledDropdown cssModule={getBs()} group>
          <DropdownToggle
            tag={'div'}
            cssModule={getBs()}
            className={`${styles['btn-upload']} ${utilStyles['my-auto']}`}
          >
            <FontAwesomeIcon icon={faPlus} style={{ color: '#fff' }} />
            <span> فایل/پوشه</span>
          </DropdownToggle>

          <DropdownMenu
            right
            end={true}
            container='body'
            className={styles['dropdown-menu']}
            cssModule={getBs()}
          >
            <CheckPermissions permissions={['upload_link']}>
              <DropdownItem
                cssModule={getBs()}
                className={styles['dropdown-menu__item']}
                onClick={() =>
                  handleModalToggle({ upload: true, stream: false })
                }
              >
                <IconUpload colorGray style={{ width: '18px', height: '18px' }} />
                <span style={{ marginRight: '8px', fontSize: '13px' }}>
                  بارگذاری فایل
                </span>
              </DropdownItem>
            </CheckPermissions>
            <CheckPermissions permissions={['stream_offline_prepare']}>
              <DropdownItem
                cssModule={getBs()}
                className={styles['dropdown-menu__item']}
                onClick={() =>
                  handleModalToggle({ upload: true, stream: true })
                }
              >
                <IconStream style={{ width: '18px', height: '18px' }} />
                <span style={{ marginRight: '8px', fontSize: '13px' }}>
                  بارگذاری فایل و استریم
                </span>
              </DropdownItem>
            </CheckPermissions>
            <CheckPermissions permissions={['folder_create']}>
              <DropdownItem
                cssModule={getBs()}
                className={styles['dropdown-menu__item']}
                onClick={toggleNewFolder}
              >
                <IconFolderPlus />
                <span style={{ marginRight: '8px', fontSize: '13px' }}>
                  ایجاد پوشه جدید
                </span>
              </DropdownItem>
            </CheckPermissions>
          </DropdownMenu>
        </UncontrolledDropdown>
      </CheckPermissions>
      {isNewFolderOpen && (
        <NewFolderModal
          isOpen={isNewFolderOpen}
          type={OperationTypes.NewFolder}
          title='ایجاد پوشه جدید'
          toggle={toggleNewFolder}
          placeholder='نام پوشه جدید را وارد نمایید'
          btnNoText='انصراف'
          btnOkText='ایجاد'
        />
      )}
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
