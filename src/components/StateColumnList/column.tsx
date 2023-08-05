import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { Row, Col } from 'reactstrap';
import moment from 'moment-jalaali';
import classnames from 'classnames';

import folder from './folder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faKey } from '@fortawesome/free-solid-svg-icons';
import MenuTools from '../../utils/MenuTools/';
import { formatBytes, brifStr } from '../../utils/index';
import { RightClick } from '../../utils';
import { TabTypes, FolderTypes } from '../../config/types';
import { Context } from '../../store/index';
import { getBs } from '../../utils/index';
import DefaultThumnail from './defaultThumbnail/index';
import { PAGE_SIZE } from '../../config/config';
// import Empty from './empty';
interface IProps {
  pages: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  tabType: number;
}

const Column: React.FunctionComponent<IProps> = ({
  pages = [],
  setHash,
  tabType
}) => {
  const { setSearchText, onSelect, currentTab, breadCrumb } =
    useContext(Context);
  const slectedRef = useRef<(HTMLDivElement | null)[]>([]);
  const contextMenuRef: any = useRef<[]>([]);
  const rightClickRef: any = useRef<any>(null);
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
      <Row cssModule={getBs()} className={`${utilStyles['m-4']}`}>
        {pages.map((page, pageIndex) => {
          const _data = page?.result?.list ? page?.result?.list : page?.result;
          return _data.map((item, index) => {
            return (
              <Col cssModule={getBs()} xs={3} md={3} lg={3} key={index}>
                <div
                  onContextMenu={(event: any) => {
                    event.preventDefault();
                    event.stopPropagation();
                    rightClickRef.current.hideContextMenu();
                    contextMenuRef.current?.map((x, i) => {
                      if (x?.isOpenState()) {
                        x?.toggle();
                      }
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
                  ref={(ref) => (slectedRef.current[index] = ref)}
                  onClick={(e) => {
                    if (!onSelect) return; /// if onSelect undefined this function will dont work
                    if (!item?.extension && !item?.isPublic) return; // for folder dont select
                    e.stopPropagation();

                    if (
                      slectedRef.current[index]?.style?.backgroundColor ===
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
                    }
                    if (onSelect) onSelect(item);
                  }}
                  onDoubleClick={() => {
                    if (TabTypes.SearchList) {
                      setSearchText('');
                    }
                    if (currentTab == TabTypes.ArchiveList) return;

                    item?.extension ? null : setHash(item?.hash);
                  }}
                  className={styles['col']}
                  style={item?.extension ? {} : { cursor: 'pointer' }}
                >
                  <div className={classnames(styles['col__img-wrapper'])}>
                    <div className={styles['col__menu-wrapper']}>
                      {item ? (
                        <MenuTools
                          isFirstCol={index % 4 === 0 ? true : false}
                          item={item}
                          tabType={currentTab}
                          ref={(ref) => {
                            const currentIndex = pageIndex * PAGE_SIZE + index;
                            // if (
                            //   item?.hash &&
                            //   !contextMenuRef.current.find(
                            //     (i) => i && i?.getHash() == item.hash
                            //   )
                            // ) {
                            return (contextMenuRef.current[currentIndex] = ref);
                            // }
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles['col__icon-access-wrapper']}>
                      {item?.isPublic ? (
                        <FontAwesomeIcon
                          className={styles['col__icon-access']}
                          icon={faGlobe}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className={styles['col__icon-access']}
                          icon={faKey}
                        />
                      )}
                    </div>
                    {item?.type != FolderTypes.folder ? (
                      item?.thumbnail &&
                      item?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (
                        <img
                          className={styles['col__img']}
                          src={`https://sandbox.podspace.ir:8443/api/files/${item?.hash}/thumbnail`}
                        />
                      ) : item ? (
                        <DefaultThumnail item={item} />
                      ) : (
                        ''
                      )
                    ) : (
                      <div className={styles['col__folder-img-wrapper']}>
                        <img
                          className={styles['col__folder-img']}
                          src={folder}
                        />
                      </div>
                    )}
                  </div>
                  <h4 className={styles['col__title']}>
                    {brifStr(item?.name, 12)}
                    {item?.extension ? `.${item.extension.toLowerCase()}` : ''}
                  </h4>
                  <div className={styles['col__volume']}>
                    {item?.type === FolderTypes.folder
                      ? ''
                      : formatBytes(item?.size)}
                  </div>
                  <div className={styles['col__date']}>
                    {moment(item?.created).format('jYYYY/jMM/jDD HH:mm:ss')}
                  </div>
                </div>
              </Col>
            );
          });
        })}
      </Row>
    </React.Fragment>
  );
};

export default Column;
