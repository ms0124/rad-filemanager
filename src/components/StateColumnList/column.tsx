import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Row, Col } from 'reactstrap';
import moment from 'moment-jalaali';
import classnames from 'classnames';

import folder from './folder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faKey } from '@fortawesome/free-solid-svg-icons';
import MenuTools from '../../utils/MenuTools/';
import { formatBytes, getThumbnailUrl, brifStr } from '../../utils/index';
import { RightClick } from '../../utils';
import { TabTypes, FolderTypes } from '../../config/types';
import { Context } from '../../store/index';
import { getBs, getViewport } from '../../utils/index';
import DefaultThumnail from './defaultThumbnail/index';
import { PAGE_SIZE } from '../../config/config';
import FileIcon from './defaultThumbnail/index';

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
  const {
    setSearchText,
    onSelect,
    currentTab,
    isShowCheckbox,
    isSandbox,
    selectedItems,
    setSelectedItems,
    itemHash,
    setItemHash,
    validExtension,
    multiValue
  } = useContext(Context);

  const slectedRef = useRef<(HTMLDivElement | null)[]>([]);
  const contextMenuRef: any = useRef<[]>([]);
  const rightClickRef: any = useRef<any>(null);
  const mainCheckboxRef = useRef<HTMLInputElement | null>(null);
  const isDoubleClick = useRef<boolean>(false);

  const closeRightClick = () => {
    contextMenuRef.current.map((x) => {
      if (x?.isOpenState()) {
        x?.toggle();
      }
    });
  };

  const handleSelectItem = (item, multiSelect = true) => {
    const isValid = validExtension.find(
      (x) =>
        x?.toLowerCase() === item?.extension?.toLowerCase() ||
        (!item.extension && x === 'dir' && item.type === FolderTypes.folder)
    );

    if (!isValid) return;

    const effectiveMultiSelect = multiValue ? multiSelect : false;

    const itemFinded = selectedItems.find((x) => x?.hash === item.hash);
    let newSelectedArray: any = [];

    if (itemFinded) {
      // item finded
      newSelectedArray = selectedItems.filter((x) => x.hash !== item.hash);
      setSelectedItems(newSelectedArray);
    } else if (
      effectiveMultiSelect ||
      (selectedItems.length === 0 && !effectiveMultiSelect)
    ) {
      // can't find item & add item
      newSelectedArray = [...selectedItems, item];
      setSelectedItems(newSelectedArray);
    } else if (!effectiveMultiSelect && selectedItems.length == 1) {
      newSelectedArray = [item];
      setSelectedItems([item]);
    }

    if (!effectiveMultiSelect && !itemHash) {
      setItemHash('');
    } else if (!effectiveMultiSelect && itemHash) {
      setItemHash(itemHash);
    }

    if (onSelect) {
      // const withOutFolders = newSelectedArray.filter((x) =>
      //   x.type === FolderTypes.folder ? false : true
      // );
      onSelect(newSelectedArray);
    }
  };
  const allLoadedItems = useMemo(() => {
    const flat: any[] = [];
    pages.forEach((page) => {
      const list = page?.result?.list ? page?.result?.list : page?.result;
      if (Array.isArray(list)) flat.push(...list);
    });
    return flat.filter((item) =>
      validExtension.find(
        (x) =>
          x?.toLowerCase() === item?.extension?.toLowerCase() ||
          (!item.extension && x === 'dir' && item.type === FolderTypes.folder)
      )
    );
  }, [pages, validExtension]);

  const allSelected = useMemo(() => {
    if (!allLoadedItems.length) return false;
    return allLoadedItems.every((item) =>
      selectedItems.find((x) => x.hash === item.hash)
    );
  }, [allLoadedItems, selectedItems]);

  const someSelected = useMemo(() => {
    if (!allLoadedItems.length) return false;
    const count = allLoadedItems.filter((item) =>
      selectedItems.find((x) => x.hash === item.hash)
    ).length;
    return count > 0 && count < allLoadedItems.length;
  }, [allLoadedItems, selectedItems]);

  useEffect(() => {
    if (mainCheckboxRef.current) {
      mainCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const deselectLoaded = () => {
    if (allLoadedItems.length === 0) return;
    const remaining = selectedItems.filter(
      (sel) => !allLoadedItems.find((item) => item.hash === sel.hash)
    );
    setSelectedItems(remaining);
    if (onSelect) {
      const withOutFolders = remaining.filter((x) =>
        x.type === FolderTypes.folder ? false : true
      );
      onSelect(withOutFolders);
    }
  };

  const selectAllLoaded = () => {
    if (!multiValue) return;
    if (allLoadedItems.length === 0) return;
    const merged: any[] = [];
    const seen = new Set<string>();
    [...selectedItems, ...allLoadedItems].forEach((it) => {
      if (!seen.has(it.hash)) {
        seen.add(it.hash);
        merged.push(it);
      }
    });
    setSelectedItems(merged);
    if (onSelect) {
      const withOutFolders = merged.filter((x) =>
        x.type === FolderTypes.folder ? false : true
      );
      onSelect(withOutFolders);
    }
  };

  useEffect(() => {
    const onSelectAll = () => selectAllLoaded();
    const onDeselectAll = () => deselectLoaded();
    window.addEventListener('fm-select-all', onSelectAll as EventListener);
    window.addEventListener('fm-deselect-all', onDeselectAll as EventListener);
    return () => {
      window.removeEventListener('fm-select-all', onSelectAll as EventListener);
      window.removeEventListener(
        'fm-deselect-all',
        onDeselectAll as EventListener
      );
    };
  }, [allLoadedItems, selectedItems]);

  const viewportName = getViewport();
  let colCount = 4;
  if (viewportName === 'xl' || viewportName === 'xxl') {
    colCount = 6;
  } else if (viewportName === 'lg' || viewportName === 'md') {
    colCount = 4;
  } else if (viewportName === 'xs') {
    colCount = 2;
  }

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
              <Col
                cssModule={getBs()}
                xs={6}
                md={3}
                lg={3}
                xl={2}
                key={item.hash}
              >
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
                    }
                  }}
                  ref={(ref) => (slectedRef.current[index] = ref)}
                  onClick={(e) => {
                    // e.stopPropagation();
                    // if (item?.type === FolderTypes.folder) return; // for folder dont select
                    // if (!item?.isPublic) return; //don't select private items
                    // if multi select is enable ==> prevent one select work
                    isDoubleClick.current = false;

                    const intervalId = setTimeout(()=>{
                    if(isDoubleClick.current == false){
                        clearInterval(intervalId);
                        handleSelectItem(item, isShowCheckbox);
                      }
                    }, 300);
                  }}
                  onDoubleClick={() => {
                    isDoubleClick.current = true;
                    if (TabTypes.SearchList) {
                      setSearchText('');
                    }
                    if (currentTab == TabTypes.ArchiveList) return;

                    item?.extension ? null : setHash(item?.hash);
                  }}
                  className={styles['col']}
                  role='butotn'
                  style={{
                    backgroundColor: selectedItems.find(
                      (x) => x.hash === item.hash
                    )
                      ? 'cornflowerblue'
                      : '',
                    cursor: item?.extension ? 'pointer' : 'auto'
                  }}
                >
                  <div className={classnames(styles['col__img-wrapper'])}>
                    <div className={styles['col__menu-wrapper']}>
                      {item ? (
                        <MenuTools
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            rightClickRef.current.hideContextMenu();
                            contextMenuRef.current?.map((x, i) => {
                              if (x?.isOpenState()) {
                                x?.toggle();
                              }
                            });
                            const currentIndex = pageIndex * PAGE_SIZE + index;
                            if (item.hash) {
                              contextMenuRef.current[currentIndex].toggle();
                            }
                          }}
                          // isFirstCol={index % 4 === 0 ? true : false}
                          isFirstCol={index % colCount === 0 ? true : false}
                          item={item}
                          tabType={currentTab}
                          allFiles={pages.flatMap(page => page?.result?.list || page?.result || [])}
                          ref={(ref) => {
                            const currentIndex = pageIndex * PAGE_SIZE + index;
                            return (contextMenuRef.current[currentIndex] = ref);
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    {isShowCheckbox && multiValue && (
                      <input
                        role='button'
                        onClick={(event) => handleSelectItem(item)}
                        type='checkbox'
                        checked={
                          !!selectedItems.find((x) => x.hash === item.hash)
                        }
                        // checked={false}
                        className={classnames(styles['col__checkbox'])}
                      />
                    )}
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

                    {/* {item?.type != FolderTypes.folder ? (
                      item?.thumbnail &&
                      item?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (                 
                        <img
                          className={styles['col__img']}
                          src={getThumbnailUrl(item?.hash, isSandbox)}
                        />
                      ) : 
                    item
                       ? (
                       
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
                    )} */}

                    {item?.type !== FolderTypes.folder ? (
                      !item?.isPublic ||
                      item?.thumbnail === 'WITHOUT_THUMBNAIL' ? (
                        <FileIcon item={item} size='2x' />
                      ) : item?.thumbnail &&
                        item?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (
                        <img
                          className={styles['col__img']}
                          src={getThumbnailUrl(item?.hash, isSandbox)}
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
                  <h4
                    className={styles['col__title']}
                    data-extension={
                      item?.extension ? '.' + item.extension.toLowerCase() : ''
                    }
                    title={`${item?.name}${
                      item?.extension ? '.' + item.extension.toLowerCase() : ''
                    }`}
                  >
                    {brifStr(item?.name, 25)}
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
