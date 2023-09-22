import styles from './style.module.scss';

import React, { useContext } from 'react';

import { Context } from '../../store/index';
import { IconTimes } from '../../utils/icons';
import classNames from 'classnames';
import { FolderTypes } from '../../config/types';
import { getThumbnailUrl } from '../../utils/index';
import DefaultThumnail from '../StateColumnList/defaultThumbnail/index';
import folder from '../StateColumnList/folder.png';

const Selected = () => {
  const { selectedItems, setSelectedItems, isSandbox } = useContext(Context);
  const handleRemoveItem = (item) => {
    const filteredItems = selectedItems.filter((x) => x.hash !== item.hash);
    setSelectedItems(filteredItems);
  };
  if (!selectedItems.length) return null;
  return (
    <div className={classNames(styles['container'])}>
      <h4 className={classNames(styles['title'])}>
        فایل های انتخاب شده({selectedItems?.length})
      </h4>
      <div className={classNames(styles['selected-wrapper'])}>
        {selectedItems.map((x) => (
          <div className={classNames(styles['selected-wrapper__item'])}>
            {x?.type != FolderTypes.folder ? (
              x?.thumbnail && x?.thumbnail.startsWith('THUMBNAIL_EXIST') ? (
                <img
                  className={styles['selected-wrapper__img']}
                  src={getThumbnailUrl(x?.hash, isSandbox)}
                />
              ) : x ? (
                <DefaultThumnail item={x} />
              ) : (
                ''
              )
            ) : (
              <span className={styles['selected-wrapper__folder']}>
                <img  src={folder} />
              </span>
            )}
            <span className={classNames(styles['selected-wrapper__name'])}>
              {x.name}
            </span>
            <IconTimes
              style={{ cursor: 'pointer', marginRight: '15px' }}
              onClick={() => handleRemoveItem(x)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selected;
