import styles from './style.module.scss';

import React, { useState, useContext } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisH,
  faCircleInfo,
  faDownload,
  faLink,
  faEdit,
  faCopy,
  faArrowsAlt,
  faShareAlt
} from '@fortawesome/free-solid-svg-icons';
import FileSaver from 'file-saver';
import { faPlayCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import MenuItem from './MenuItem';
import Modal from '../rightClick/Modal';
import { OperationTypes } from '../../config/types';
import { Context } from '../../store/index';
import { download } from '../../config/api';
import { TabTypes } from '../../config/types';
import { useArchiveDelete, useArchiveRestor } from '../../config/hooks';
import { objectToQueryString } from '../../utils/index';
import CheckPermissions from '../../components/CheckPermissions';
import { getBs } from '../../utils/index';
import { IconCopy,IconMove, IconEdit, IconTrash, IconDownload, IconCircleInfo }  from '../../utils/icons';


interface IProps {
  item: { name: string; hash: string; extension: string };
  tabType: number;
}

const MenuTools: React.FunctionComponent<IProps> = ({
  item,
  tabType,
  ...props
}) => {
  const {
    itemHash,
    setItemHash,
    setOperationType: setActionType,
    currentHash
  } = useContext(Context);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [operationType, setOperationType] = useState<number | null>();

  const toggleModal: () => void = () => setIsOpenModal(!isOpenModal);
  const toggle: () => void = () => setIsOpen(!isOpen);

  const archiveDelete = useArchiveDelete(currentHash);
  const archiveRestor = useArchiveRestor(currentHash);
  const clickHandler = (type) => {
    switch (type) {
      case OperationTypes.Remove:
        toggleModal();
        setOperationType(OperationTypes.Remove);
        break;
      case OperationTypes.Rename:
        toggleModal();
        setOperationType(OperationTypes.Rename);
        break;
      case OperationTypes.Copy:
        setItemHash(item?.hash);
        setActionType(OperationTypes.Copy);
        break;
      case OperationTypes.Cut:
        setItemHash(item?.hash);
        setActionType(OperationTypes.Cut);
        break;
      case OperationTypes.Download:
        const extension = item.extension.toLowerCase();
        download(item?.hash).then((blob) => {
          FileSaver.saveAs(blob, `${item?.hash}.${extension}`);
        });
        break;
      case OperationTypes.RemoveArchive:
        archiveDelete.mutateAsync(objectToQueryString(item.hash));
        break;
      case OperationTypes.RestoreArchive:
        archiveRestor.mutateAsync(item.hash);
        break;
    }
  };

  return (
    <React.Fragment>
      {isOpenModal && operationType === OperationTypes.Remove ? (
        <Modal
          isOpen={isOpenModal}
          toggle={toggleModal}
          type={OperationTypes.Remove}
          btnNoText='حذف نشود'
          btnOkText='بله حذف شود'
          title={'آیا از حذف مورد انتخاب شده اطمینان دارید؟'}
          item={item}
        />
      ) : (
        ''
      )}
      {isOpenModal && operationType === OperationTypes.Rename ? (
        <Modal
          isOpen={isOpenModal}
          toggle={toggleModal}
          type={OperationTypes.Rename}
          btnNoText='انصراف'
          btnOkText='تغیر نام'
          title={'آیا از تغیر نام مورد انتخاب شده اطمینان دارید؟'}
          item={item}
        />
      ) : (
        ''
      )}
      <Dropdown
        cssModule={getBs()}
        isOpen={isOpen}
        toggle={toggle}
        direction={'down'}
      >
        <DropdownToggle
          cssModule={getBs()}
          tag='div'
          className={styles['col__icon-3'] + ' col__icon-3'}
        >
          <FontAwesomeIcon
            onClick={toggle}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded={'false'}
            icon={faEllipsisH}
          />
        </DropdownToggle>
        <DropdownMenu
          cssModule={getBs()}
          {...props}
          end
          className={styles['dropdown-menu-wrapper'] }
        >
          {/* <MenuItem title={'پخش ویدئو'} icon={faPlayCircle} />
          <MenuItem title='اطلاعات فایل' icon={faCircleInfo} /> */}
          <CheckPermissions permissions={['download']}>
            {item?.extension && (
              <MenuItem
                clickHandler={() => clickHandler(OperationTypes.Download)}
                title='دانلود فایل'
                icon={<IconDownload />}
                type={OperationTypes.Download}
              />
            )}
          </CheckPermissions>
          {item.extension && <DropdownItem cssModule={getBs()} divider />}
          <CheckPermissions permissions={['rename']}>
            <MenuItem
              clickHandler={() => clickHandler(OperationTypes.Rename)}
              title='تغییر نام'
              icon={<IconEdit/>}
              enTitle='rename'
            />
          </CheckPermissions>
          <CheckPermissions permissions={['copy']}>
             <MenuItem
              clickHandler={() => clickHandler(OperationTypes.Copy)}
              title='کپی'
              icon={<IconCopy/>}
              enTitle='copy'
            /> 
          </CheckPermissions>
          <CheckPermissions permissions={['cut']}>
             <MenuItem
              clickHandler={() => clickHandler(OperationTypes.Cut)}
              title='جابه‌جایی'
              icon={<IconMove />}
              enTitle='move'
            /> 
          </CheckPermissions>
          <CheckPermissions permissions={['delete']}>
             <MenuItem
              clickHandler={() => clickHandler(OperationTypes.Remove)}
              title='حذف'
              icon={<IconTrash />}
              enTitle='delete'
            /> 
          </CheckPermissions>
          {/* <DropdownItem divider />
          <MenuItem
            title='اشتراک گذازی یک فایل'
            icon={faShareAlt}
            enTitle='share'
          /> */}
          
          {tabType == TabTypes.ArchiveList ? (
            <React.Fragment>
              <CheckPermissions
                permissions={[
                  'archive_delete',
                  'archive_restore'
                ]}
              >
                <DropdownItem cssModule={getBs()} divider />
                <CheckPermissions permissions={['archive_delete']}>
                  <MenuItem
                    clickHandler={() =>
                      clickHandler(OperationTypes.RemoveArchive)
                    }
                    title='حذف دائمی'
                    icon={<IconTrash/>}
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['archive_restore']}>
                  <MenuItem
                    clickHandler={() =>
                      clickHandler(OperationTypes.RestoreArchive)
                    }
                    title='بازیابی'
                    icon={<IconCircleInfo/>}
                  />
                </CheckPermissions>
              </CheckPermissions>
            </React.Fragment>
          ) : (
            ''
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default MenuTools;
