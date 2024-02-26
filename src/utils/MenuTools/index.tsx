import styles from './style.module.scss';

import React, {
  useState,
  useContext,
  forwardRef,
  useRef,
  useEffect
} from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import FileSaver from 'file-saver';
import { faPlayCircle, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import MenuItem from './MenuItem';
import Modal from '../rightClick/Modal';
import { FolderTypes, OperationTypes } from '../../config/types';
import { Context } from '../../store/index';
import { download } from '../../config/api';
import { TabTypes } from '../../config/types';
import {
  useArchiveDelete,
  useArchiveRestor,
  getHeader
} from '../../config/hooks';
import { objectToQueryString, serializeUrl } from '../../utils/index';
import CheckPermissions from '../../components/CheckPermissions';
import { getBs } from '../../utils/index';
import {
  IconCopy,
  IconMove,
  IconEdit,
  IconTrash,
  IconDownload,
  IconCircleInfo
} from '../../utils/icons';
import ShareFile from '../../components/ShareFile/index';

interface IProps {
  item: { name: string; hash: string; extension: string; type: string };
  tabType: number;
  ref: any;
  isFirstCol?: boolean;
}

const MenuTools: React.FunctionComponent<IProps> = forwardRef(
  ({ item, tabType, isFirstCol = false, ...props }, ref) => {
    const {
      itemHash,
      setItemHash,
      setOperationType: setActionType,
      isShowCheckbox,
      currentHash,
      selectedItems,
      setSelectedItems
    } = useContext(Context);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const currentIsOpenRef = useRef(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [operationType, setOperationType] = useState<number | null>();
    const headers = getHeader(false);

    const [isOpenShareFile, setIsOpenShareFile] = useState<Boolean>(false);
    const toggleShareFile = () => {
      setIsOpenShareFile((prev) => !prev);
    };

    const toggleModal: () => void = () => setIsOpenModal(!isOpenModal);
    const toggle: () => void = () => {
      setIsOpen((prev) => {
        currentIsOpenRef.current = !prev;
        return !prev;
      });
    };
    const isOpenState = () => currentIsOpenRef.current;
    const getHash = () => item.hash;
    const getName = () => item.name;

    React.useImperativeHandle(ref, () => ({
      toggle,
      isOpenState,
      getHash,
      getName
    }));

    const archiveDelete = useArchiveDelete(currentHash);
    const archiveRestor = useArchiveRestor(currentHash);
    const clickHandler = (type) => {
      const hashes: any = [];
      hashes.push(item?.hash);

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
          if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            // some action in the futuer
            // if multi item select
          } else {
            setItemHash(item?.hash);
          }
          setActionType(OperationTypes.Copy);
          break;
        case OperationTypes.Cut:
          if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            // some action in the futuer
            // if multi item select
          } else {
            setItemHash(item?.hash);
          }
          setActionType(OperationTypes.Cut);
          break;
        case OperationTypes.Download:
          if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            selectedItems.map((x) => {
              if (x?.type !== FolderTypes.folder)
                download(x?.hash, headers).then((blob) => {
                  FileSaver.saveAs(
                    blob,
                    `${x?.hash}.${x?.extension?.toLowerCase()}`
                  );
                });
            });
            setSelectedItems([]);
          } else if (
            item &&
            Array.isArray(selectedItems) &&
            selectedItems.length === 0
          ) {
            const extension = item.extension.toLowerCase();
            download(item?.hash, headers).then((blob) => {
              FileSaver.saveAs(blob, `${item?.hash}.${extension}`);
            });
          }
          break;
        case OperationTypes.RemoveArchive:
          archiveDelete.mutateAsync(serializeUrl({ hashes }));
          break;
        case OperationTypes.RestoreArchive:
          archiveRestor.mutateAsync(serializeUrl({ hashes }));
          break;
        case OperationTypes.Share:
          setIsOpenShareFile(true);
      }
    };

    // useEffect(() => {
    //   const element: any = menuRef.current?.nextSibling;
    //   setTimeout(() => {
    //     if (isFirstCol && isOpen && element) {
    //       element.style.transform = element.style.transform?.replace(
    //         /\(-.*?,/,
    //         '( -15px,'
    //       );
    //     }
    //   }, 50);
    // }, [isOpen]);

    return (
      <React.Fragment>
        {isOpenShareFile && (
          <ShareFile isOpen={isOpenShareFile} toggle={toggleShareFile} />
        )}
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
            btnOkText='تغییر نام'
            title={'آیا از تغییر نام مورد انتخاب شده اطمینان دارید؟'}
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
            tag='span'
            caret={false}
            className={styles['col__icon-3'] + ' col__icon-3'}
            innerRef={menuRef}
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
            right
            end={true}
            cssModule={getBs()}
            {...props}
            className={`${styles['dropdown-menu-wrapper']}`}
          >
            <CheckPermissions permissions={['download']}>
              {item?.type === FolderTypes.folder || (
                <MenuItem
                  clickHandler={() => clickHandler(OperationTypes.Download)}
                  title='دانلود فایل'
                  icon={<IconDownload />}
                  type={OperationTypes.Download}
                />
              )}
            </CheckPermissions>
            {item?.type === FolderTypes.folder || (
              <DropdownItem cssModule={getBs()} divider />
            )}
            {tabType != TabTypes.ArchiveList ? (
              <React.Fragment>
                <CheckPermissions permissions={['rename']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Rename)}
                    title='تغییر نام'
                    icon={<IconEdit />}
                    enTitle='rename'
                    disabled={isShowCheckbox}
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['copy']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Copy)}
                    title='کپی'
                    icon={<IconCopy />}
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
                    disabled={isShowCheckbox}
                  />
                </CheckPermissions>
                {/* <CheckPermissions permissions={['share_detail']}>
                  <DropdownItem cssModule={getBs()} divider />
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Share)}
                    title='اشتراک گذاری فایل'
                    icon={<IconTrash />}
                    enTitle='share'
                    disabled={isShowCheckbox}
                  />
                </CheckPermissions> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CheckPermissions
                  permissions={['archive_delete', 'archive_restore']}
                >
                  <CheckPermissions permissions={['archive_delete']}>
                    <MenuItem
                      disabled={isShowCheckbox}
                      clickHandler={() =>
                        clickHandler(OperationTypes.RemoveArchive)
                      }
                      title='حذف دائمی'
                      icon={<IconTrash />}
                    />
                  </CheckPermissions>
                  <CheckPermissions permissions={['archive_restore']}>
                    <MenuItem
                      disabled={isShowCheckbox}
                      clickHandler={() =>
                        clickHandler(OperationTypes.RestoreArchive)
                      }
                      title='بازیابی'
                      icon={<IconCircleInfo />}
                    />
                  </CheckPermissions>
                </CheckPermissions>
              </React.Fragment>
            )}
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
    );
  }
);

export default MenuTools;
