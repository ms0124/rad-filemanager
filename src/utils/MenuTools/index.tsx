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
import {
  faPlayCircle,
  faTrashAlt,
  faEye
} from '@fortawesome/free-regular-svg-icons';
import MenuItem from './MenuItem';
import Modal from '../rightClick/Modal';
import { FolderTypes, OperationTypes } from '../../config/types';
import { Context } from '../../store/index';
import { download, downloadLink } from '../../config/api';
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
  IconCircleInfo,
  IconShare,
  IconPreview
} from '../../utils/icons';
import ShareFile from '../../components/ShareFile/index';
import PreviewModal from '../../components/PreviewModal/index';
import { toast } from 'react-toastify';

interface IProps {
  item: {
    name: string;
    hash: string;
    extension: string;
    type: string;
    isPublic: boolean;
  };
  tabType: number;
  ref: any;
  isFirstCol?: boolean;
  onClick?: (event) => void;
  allFiles?: any[];
}

const MAX_BULK_ARCHIVE_ACTION = 50;

const MenuTools = forwardRef<any, IProps>(
  (
    { item, tabType, isFirstCol = false, onClick, allFiles = [], ...props },
    ref
  ) => {
    const {
      itemHash,
      isSandbox,
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

    const [isOpenShareFile, setIsOpenShareFile] = useState<boolean>(false);
    const toggleShareFile = () => {
      setIsOpenShareFile((prev) => !prev);
    };

    const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);
    const togglePreview = () => {
      setIsOpenPreview((prev) => !prev);
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

    const clickHandler = async (type) => {
      const hashes: string[] =
        Array.isArray(selectedItems) && selectedItems.length > 0
          ? selectedItems.map((x) => x?.hash)
          : [item?.hash];

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
            if (selectedItems.length === 1) {
              setItemHash(item?.hash);
            }
          } else {
            setItemHash(item?.hash);
          }
          setActionType(OperationTypes.Copy);
          break;
        case OperationTypes.Cut:
          if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            if (selectedItems.length === 1) {
              setItemHash(item?.hash);
            }
          } else {
            setItemHash(item?.hash);
          }
          setActionType(OperationTypes.Cut);
          break;
        case OperationTypes.Download:
          if (Array.isArray(selectedItems) && selectedItems.length > 0) {
            await Promise.all(
              selectedItems.map(async (x) => {
                if (x?.type !== FolderTypes.folder) {
                  try {
                    const res = await downloadLink(
                      objectToQueryString({
                        fileHash: x.hash,
                        revokeAbility: true
                      })
                    );
                    const { result } = res;
                    const downloadLinkData = result[0]?.downloadLink;

                    const blob = await download({
                      isSandbox,
                      downloadLink: downloadLinkData
                    });
                    FileSaver.saveAs(
                      blob,
                      `${x?.name}.${x?.extension?.toLowerCase()}`
                    );
                  } catch (error) {
                    console.error(`Error downloading ${x?.name}:`, error);
                  }
                }
              })
            );
            setSelectedItems([]);
          } else if (
            item &&
            Array.isArray(selectedItems) &&
            selectedItems.length === 0
          ) {
            const extension = item.extension.toLowerCase();
            downloadLink(
              objectToQueryString({ fileHash: item.hash, revokeAbility: true })
            ).then((res) => {
              const { result } = res;
              const downloadLink = result[0]?.downloadLink;

              download({ isSandbox, downloadLink }).then((blob) => {
                FileSaver.saveAs(blob, `${item?.name}.${extension}`);
              });
            });
          }
          break;
        case OperationTypes.RemoveArchive:
          if (hashes.length >= MAX_BULK_ARCHIVE_ACTION) {
            toast.error('امکان حذف بیشتر از 50 فایل وجود ندارد.');
            break;
          }
          archiveDelete.mutateAsync(serializeUrl({ hashes }));
          setSelectedItems([]);
          break;
        case OperationTypes.RestoreArchive:
          if (hashes.length >= MAX_BULK_ARCHIVE_ACTION) {
            toast.error('امکان بازیابی بیشتر از 50 فایل وجود ندارد.');
            break;
          }
          archiveRestor.mutateAsync(serializeUrl({ hashes }));
          setSelectedItems([]);
          break;
        case OperationTypes.Share:
          setIsOpenShareFile(true);
          break;
        case OperationTypes.Preview:
          setIsOpenPreview(true);
          break;
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
          <ShareFile
            isOpen={isOpenShareFile}
            toggle={toggleShareFile}
            hash={item?.hash}
            isPublic={item?.isPublic}
          />
        )}
        {isOpenPreview && (
          <PreviewModal
            isOpen={isOpenPreview}
            toggle={togglePreview}
            item={item}
            allFiles={allFiles}
          />
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
            onClick={onClick}
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
              {item?.type == FolderTypes.folder ||
              tabType == TabTypes.ArchiveList ? (
                ''
              ) : (
                <MenuItem
                  clickHandler={() => clickHandler(OperationTypes.Download)}
                  title='دانلود فایل'
                  enTitle='Download'
                  icon={
                    <IconDownload style={{ width: '18px', height: '16px' }} />
                  }
                  type={OperationTypes.Download}
                />
              )}
            </CheckPermissions>
            {item?.type == FolderTypes.folder ||
            tabType == TabTypes.ArchiveList ? (
              ''
            ) : (
              <MenuItem
                clickHandler={() => clickHandler(OperationTypes.Preview)}
                title='پیش نمایش و جزئیات'
                enTitle='Preview'
                icon={
                  <FontAwesomeIcon
                    icon={faEye}
                    style={{ width: '18px', height: '16px' }}
                  />
                }
                type={OperationTypes.Preview}
              />
            )}
            {item?.type == FolderTypes.folder ||
            tabType == TabTypes.ArchiveList ? (
              ''
            ) : (
              <DropdownItem cssModule={getBs()} divider />
            )}
            {tabType != TabTypes.ArchiveList ? (
              <React.Fragment>
                <CheckPermissions permissions={['rename']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Rename)}
                    title='تغییر نام'
                    icon={
                      <IconEdit style={{ width: '18px', height: '16px' }} />
                    }
                    enTitle='Rename'
                    disabled={isShowCheckbox}
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['copy']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Copy)}
                    title='کپی'
                    icon={
                      <IconCopy style={{ width: '18px', height: '16px' }} />
                    }
                    enTitle='Copy'
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['cut']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Cut)}
                    title='جابه‌جایی'
                    icon={
                      <IconMove style={{ width: '18px', height: '16px' }} />
                    }
                    enTitle='Move'
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['batch_delete']}>
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Remove)}
                    title='آرشیو'
                    icon={
                      <IconTrash style={{ width: '18px', height: '16px' }} />
                    }
                    enTitle='Delete'
                  />
                </CheckPermissions>
                <CheckPermissions permissions={['share_detail']}>
                  <DropdownItem cssModule={getBs()} divider />
                  <MenuItem
                    clickHandler={() => clickHandler(OperationTypes.Share)}
                    title='اشتراک گذاری فایل'
                    icon={
                      <IconShare style={{ width: '18px', height: '16px' }} />
                    }
                    enTitle='share'
                    disabled={isShowCheckbox}
                  />
                </CheckPermissions>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CheckPermissions
                  permissions={['archive_delete', 'archive_restore']}
                >
                  <CheckPermissions permissions={['archive_delete']}>
                    <MenuItem
                      clickHandler={() =>
                        clickHandler(OperationTypes.RemoveArchive)
                      }
                      title='حذف دائمی'
                      icon={
                        <IconTrash style={{ width: '18px', height: '16px' }} />
                      }
                    />
                  </CheckPermissions>
                  <CheckPermissions permissions={['archive_restore']}>
                    <MenuItem
                      clickHandler={() =>
                        clickHandler(OperationTypes.RestoreArchive)
                      }
                      title='بازیابی'
                      icon={
                        <IconCircleInfo
                          style={{ width: '18px', height: '16px' }}
                        />
                      }
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
