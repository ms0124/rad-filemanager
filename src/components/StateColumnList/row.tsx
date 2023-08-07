import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { FunctionComponent, useContext, useRef } from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faGlobe } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';

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
interface IProps {
  pages: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  tabType: number;
}

const Row: FunctionComponent<IProps> = ({ pages = [], setHash }) => {
  const { setSearchText, onSelect, currentTab, isSandbox } =
    useContext(Context);

  const slectedRef = useRef<(HTMLDivElement | null)[]>([]);
  const contextMenuRef: any = useRef<[]>([]);
  return (
    <Table cssModule={getBs()} className={styles['table-wrapper']}>
      <thead>
        <tr>
          <th className={`${utilStyles['text-center']} `} colSpan={3}>
            نام فایل
          </th>
          <th className={`${utilStyles['text-center']}`}>تاریخ ایجاد</th>
          <th className={`${utilStyles['text-center']}`}>تاریخ ویرایش</th>
          <th className={`${utilStyles['text-center']}`}>حجم فایل</th>
          <th className={`${utilStyles['text-center']}`}>وضعیت اشتراک گذاری</th>
        </tr>
      </thead>
      <tbody>
        {pages.map((page, pageIndex) => {
          const _data = page?.result?.list ? page?.result?.list : page?.result;
          return _data.map((item, index) => (
            <tr
              onContextMenu={(event: any) => {
                event.preventDefault();
                event.stopPropagation();
                contextMenuRef.current.map((item, i) => {
                  item?.isOpenState() && item?.toggle();
                });
                const currentIndex = pageIndex * PAGE_SIZE + index;
                if (item.hash) {
                  contextMenuRef.current[currentIndex].toggle();
                  // contextMenuRef.current
                  //   .find((i, index) => {
                  //     return i && i?.getHash() === item.hash;
                  //   })
                  //   ?.toggle();
                }
              }}
              key={index}
              ref={(ref) => (slectedRef.current[index] = ref)}
            >
              <td className={styles['vertical-align-top']}>
                <MenuTools
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
              <td className={styles['thumnail-wrraper']}>
                {item?.type != FolderTypes.folder ? (
                  item?.thumbnail &&
                  item?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (
                    <img src={getThumbnailUrl(item?.hash, isSandbox)} />
                  ) : item ? (
                    <DefaultThumnail item={item} />
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
                className={`${utilStyles['text-end']}`}
                scope='row'
                onClick={() => {
                  if (!item?.extension && !item?.isPublic) return;
                  if (
                    slectedRef.current[index]?.style.backgroundColor ===
                    'cornflowerblue'
                  ) {
                    slectedRef.current[index]!.style!.backgroundColor =
                      'rgb(250,250,250)';
                  } else {
                    slectedRef.current.map(
                      (item) =>
                        (item!.style!.backgroundColor = 'rgb(250,250,250)')
                    );
                    slectedRef.current[index]!.style!.backgroundColor =
                      'cornflowerblue';
                    if (onSelect) onSelect(item);
                  }
                }}
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => {
                  if (TabTypes.SearchList) {
                    setSearchText('');
                  }
                  item?.extension ? null : setHash(item?.hash);
                }}
              >
                <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
                  {`${brifStr(item?.name)}${
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
                {' '}
                {moment(item?.updated).format('jYYYY/jMM/jDD HH:mm:ss')}
              </td>
              <td
                className={`${styles['dir-ltr']} ${utilStyles['text-center']}`}
              >
                {item?.type === FolderTypes.folder
                  ? ''
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
  );
};

export default Row;
