import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';
import classnames from 'classnames';
import { TabTypes } from '../../config/types';
import { getBs } from '../../utils/index';

const index = () => {
  const {
    breadCrumb,
    setCurrentHash,
    currentHash,
    currentTab,
    setCurrentTab,
    setSearchText
  } = useContext(Context);

  const breadCrumbList = useMemo(() => {
    return breadCrumb
      ?.reverse()
      ?.filter((item, index) =>
        item?.attributes ? item?.attributes[0] !== 'ROOT_FOLDER' : true
      );
  }, [breadCrumb]);

  const onBackClickHandler = () => {
    // if deep === one folder
    if (breadCrumbList.length === 1 && breadCrumbList[0].parentHash) {
      setCurrentHash(breadCrumbList[0].parentHash);
    }
    // if deep === more than one folder
    const objDestination = breadCrumbList.find((_, index) => {
      if (index == breadCrumbList.length - 2) {
        return true;
      }
      return false;
    });
    if (objDestination && objDestination.hash) {
      setCurrentHash(objDestination.hash);
    }
  };

  return (
    <div className={classnames(styles['bread-crumb'])}>
      <div className={classnames(styles['bread-crumb__wrapper-item'])}>
        {/* <span className={styles['bread-crumb__your-path']}>مسیر شما: </span> */}
        <span
          className={classnames(styles['bread-crumb__item'])}
          onClick={() => {
            // for after search with click go to file tab
            if (TabTypes.SearchList) setSearchText('');

            if (currentTab !== TabTypes.FileList) {
              setCurrentTab(TabTypes.FileList);
            }

            setCurrentHash('root');
          }}
        >
          همه فایل ها{' '}
        </span>
        <span>
          {breadCrumbList?.map((item, index) => (
            <span
              className={classnames(
                { [styles['bread-crumb__item']]: !item?.disabled },
                {
                  [styles['bread-crumb__item--disabled']]: item?.disabled
                }
              )}
              key={index}
              onClick={() => {
                // for after search with click go to file tab
                if (!item?.disabled && TabTypes.SearchList) {
                  setSearchText('');
                }
                item?.disabled ? null : setCurrentHash(item.hash);
              }}
            >
              <FontAwesomeIcon
                icon={faAngleLeft}
                className={utilStyles['px-2']}
              />
              <span>{item?.name}</span>
            </span>
          ))}
        </span>
      </div>
      {/* <div className={styles['bread-crumb__copyright']}>copy right</div> */}
      {currentTab === TabTypes.FileList && breadCrumbList.length > 0 ? (
        <div
          onClick={onBackClickHandler}
          className={classnames(styles['bread-crumb__back'])}
        >
          <span>بازگشت</span>
          <FontAwesomeIcon icon={faAngleLeft} className={getBs()['px-2']} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default index;
