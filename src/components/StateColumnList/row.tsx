import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { FunctionComponent, useContext, useRef } from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faGlobe } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';
import classnames from 'classnames';

import {
  formatBytes,
  brifStr,
  getBs,
  getThumbnailUrl
} from '../../utils/index';
import { Context } from '../../store/index';
import MenuTools from '../../utils/MenuTools/';
import DefaultThumnail from '../StateColumnList/defaultThumbnail/';
import { TabTypes, FolderTypes } from '../../config/types';
import { PAGE_SIZE } from '../../config/config';
import folder from './folder.png';
import { RightClick } from '../../utils';
interface IProps {
  pages: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  tabType: number;
}

const Row: FunctionComponent<IProps> = ({ pages = [], setHash }) => {
  const {
    setSearchText,
    onSelect,
    currentTab,
    isSandbox,
    isShowCheckbox,
    selectedItems,
    setSelectedItems,
    validExtension
  } = useContext(Context);

  const slectedRef = useRef<(HTMLDivElement | null)[]>([]);
  const contextMenuRef: any = useRef<[]>([]);

  const rightClickRef: any = useRef<any>(null);

  const handleSelectItem = (item, multiSelect = true) => {
    const isValid = validExtension.find(
      (x) =>
        x?.toLowerCase() === item?.extension?.toLowerCase() ||
        (!item.extension && x === 'dir' && item.type === FolderTypes.folder)
    );
    if (!isValid) return;
    const itemFinded = selectedItems.find((x) => x?.hash === item.hash);
    let newSelectedArray: any = [];

    if (itemFinded) {
      // item finded
      newSelectedArray = selectedItems.filter((x) => x.hash !== item.hash);
      setSelectedItems(newSelectedArray);
    } else if (multiSelect || (selectedItems.length === 0 && !multiSelect)) {
      // can't find item & add item
      newSelectedArray = [...selectedItems, item];
      setSelectedItems(newSelectedArray);
    } else if (!multiSelect && selectedItems.length == 1) {
      newSelectedArray = [item];
      setSelectedItems([item]);
    }

    if (onSelect) {
      const withOutFolders = newSelectedArray.filter((x) =>
        x.type === FolderTypes.folder ? false : true
      );
      onSelect(withOutFolders);
    }
  };
  const closeRightClick = () => {
    contextMenuRef.current.map((x) => {
      if (x?.isOpenState()) {
        x?.toggle();
      }
    });
  };
  return (
    <React.Fragment>
      <RightClick
        ref={(ref) => (rightClickRef.current = ref)}
        query='#rightclick'
        close={closeRightClick}
      />
      <Table cssModule={getBs()} className={styles['table-wrapper']}>
        <thead>
          <tr>
            <th></th>
            <th className={`${utilStyles['text-center']} `} colSpan={3}>
              نام فایل
            </th>
            <th className={`${utilStyles['text-center']}`}>تاریخ ایجاد</th>
            <th className={`${utilStyles['text-center']}`}>تاریخ ویرایش</th>
            <th className={`${utilStyles['text-center']}`}>حجم فایل</th>
            <th className={`${utilStyles['text-center']}`}>
              وضعیت اشتراک گذاری
            </th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, pageIndex) => {
            const _data = page?.result?.list
              ? page?.result?.list
              : page?.result;
            return _data.map((item, index) => (
              <tr
                onContextMenu={(event: any) => {
                  event.preventDefault();
                  event.stopPropagation();
                  rightClickRef.current.hideContextMenu();
                  contextMenuRef.current.map((item, i) => {
                    item?.isOpenState() && item?.toggle();
                  });
                  const currentIndex = pageIndex * PAGE_SIZE + index;
                  if (item.hash) {
                    contextMenuRef.current[currentIndex].toggle();
                  }
                }}
                key={item.hash}
                style={{
                  backgroundColor: selectedItems.find(
                    (x) => x.hash === item?.hash
                  )
                    ? 'cornflowerblue'
                    : '',
                  cursor: item?.extension ? 'pointer' : 'auto'
                }}
                ref={(ref) => (slectedRef.current[index] = ref)}
              >
                <td className={styles['vertical-align-top']}>
                  <MenuTools
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      rightClickRef.current.hideContextMenu();
                      contextMenuRef.current.map((item, i) => {
                        item?.isOpenState() && item?.toggle();
                      });
                      const currentIndex = pageIndex * PAGE_SIZE + index;
                      if (item.hash) {
                        contextMenuRef.current[currentIndex].toggle();
                      }
                    }}
                    item={item}
                    tabType={currentTab}
                    // ref={(ref) => (contextMenuRef.current[index] = ref)}
                    ref={(ref) => {
                      const currentIndex = pageIndex * PAGE_SIZE + index;
                      // if (
                      // item?.hash
                      // &&   !contextMenuRef.current.find(
                      //     (i) => i && i?.getHash() == item.hash
                      // )
                      // ) {
                      return (contextMenuRef.current[currentIndex] = ref);
                      // }
                    }}
                  />
                </td>
                <td>
                  {isShowCheckbox && (
                    <input
                      role='button'
                      onClick={(_) => handleSelectItem(item)}
                      type='checkbox'
                      checked={
                        !!selectedItems.find((x) => x.hash === item.hash)
                      }
                      className={classnames(styles['table-wrapper__checkbox'])}
                    />
                  )}
                </td>
                <td
                  onDoubleClick={() => {
                    if (TabTypes.SearchList) {
                      setSearchText('');
                    }
                    item?.extension ? null : setHash(item?.hash);
                  }}
                  className={styles['thumnail-wrraper']}
                >
                  {item?.type != FolderTypes.folder ? (
                    item?.thumbnail &&
                    item?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (
                      <img src={getThumbnailUrl(item?.hash, isSandbox)} />
                    ) : item ? (
                      <DefaultThumnail size='2x' item={item} />
                    ) : (
                      ''
                    )
                  ) : (
                    <div>
                      <img
                        className={styles['thumnail-wrraper__folder']}
                        src={folder}
                      />
                    </div>
                  )}
                </td>
                <td
                  width={'30%'}
                  className={`${utilStyles['text-end']}`}
                  scope='row'
                  onClick={(e) => {
                    e.stopPropagation();
                    // if (item?.type === FolderTypes.folder) return; // for folder dont select
                    // if (!item?.isPublic) return; //don't select private items
                    // if multi select is enable ==> prevent one select work
                    handleSelectItem(item, isShowCheckbox);
                  }}
                  role='button'
                  onDoubleClick={() => {
                    if (TabTypes.SearchList) {
                      setSearchText('');
                    }
                    item?.extension ? null : setHash(item?.hash);
                  }}
                >
                  <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
                    {`${brifStr(item?.name, 50)}${
                      item?.extension ? '.' + item.extension.toLowerCase() : ''
                    }`}
                  </span>
                </td>
                <td
                  className={`${styles['dir-ltr']} ${utilStyles['text-center']}`}
                >
                  {moment(item?.created).format('jYYYY/jMM/jDD HH:mm:ss')}
                </td>
                <td
                  className={`${styles['dir-ltr']} ${utilStyles['text-center']}`}
                >
                  {moment(item?.updated).format('jYYYY/jMM/jDD HH:mm:ss')}
                </td>
                <td
                  className={`${styles['dir-ltr']} ${utilStyles['text-center']}`}
                >
                  {item?.type === FolderTypes.folder
                    ? '-'
                    : formatBytes(item?.size)}
                </td>
                <td
                  className={`${utilStyles['text-center']}`}
                  style={{ color: '#6184ff' }}
                >
                  {item?.isPublic ? (
                    <FontAwesomeIcon icon={faGlobe} />
                  ) : (
                    <FontAwesomeIcon icon={faKey} />
                  )}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export default Row;
