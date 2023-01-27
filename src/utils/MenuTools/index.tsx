import './style.scss';

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

interface IProps {
  item: { name: string; hash: string; extension: string };
}

const MenuTools: React.FunctionComponent<IProps> = ({ item, ...props }) => {
  const {
    itemHash,
    setItemHash,
    setOperationType: setActionType,
    
  } = useContext(Context);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [operationType, setOperationType] = useState<number | null>();

  const toggleModal: () => void = () => setIsOpenModal(!isOpenModal);
  const toggle: () => void = () => setIsOpen(!isOpen);

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
      <Dropdown isOpen={isOpen} toggle={toggle} direction={'down'}>
        <DropdownToggle tag='div' className='col__icon-3 fas fa-caret-up'>
          <FontAwesomeIcon
            onClick={toggle}
            data-toggle='dropdown'
            aria-haspopup='true'
            aria-expanded={'false'}
            icon={faEllipsisH}
          />
        </DropdownToggle>
        <DropdownMenu {...props} end className='dropdown-menu-wrapper'>
          {/* <MenuItem title={'پخش ویدئو'} icon={faPlayCircle} />
          <MenuItem title='اطلاعات فایل' icon={faCircleInfo} /> */}
          <MenuItem
            clickHandler={() => clickHandler(OperationTypes.Download)}
            title='دانلود فایل'
            icon={faDownload}
            type={OperationTypes.Download}
          />
          <DropdownItem divider />
          <MenuItem
            clickHandler={() => clickHandler(OperationTypes.Rename)}
            title='تغییر نام'
            icon={faEdit}
            enTitle='rename'
          />
          <MenuItem
            clickHandler={() => clickHandler(OperationTypes.Copy)}
            title='کپی'
            icon={faCopy}
            enTitle='copy'
          />
          <MenuItem
            clickHandler={() => clickHandler(OperationTypes.Cut)}
            title='جابه‌جایی'
            icon={faArrowsAlt}
            enTitle='move'
          />
          <MenuItem
            clickHandler={() => clickHandler(OperationTypes.Remove)}
            title='حذف'
            icon={faTrashAlt}
            enTitle='delete'
          />
          <DropdownItem divider />
          <MenuItem
            title='اشتراک گذازی یک فایل'
            icon={faShareAlt}
            enTitle='share'
          />
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default MenuTools;
