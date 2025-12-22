import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React, { useContext, useMemo, useEffect, useRef } from 'react';
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
    setSearchText,
    defaultDirectory
  } = useContext(Context);

  const checkboxRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleSelectAll = () => {
      if (checkboxRef.current) {
        checkboxRef.current.checked = true;
      }
    };
    const handleDeselectAll = () => {
      if (checkboxRef.current) {
        checkboxRef.current.checked = false;
      }
    };

    window.addEventListener('fm-select-all', handleSelectAll);
    window.addEventListener('fm-deselect-all', handleDeselectAll);
    return () => {
      window.removeEventListener('fm-select-all', handleSelectAll);
      window.removeEventListener('fm-deselect-all', handleDeselectAll);
    };
  }, []);

  return (
    <div className={classnames(styles['bread-crumb'])}>
      <div className={classnames(styles['bread-crumb__wrapper-item'])}>
        <div
          style={{
            marginRight: '6px',
            marginLeft: '12px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <input
            ref={checkboxRef}
            style={{ cursor: 'pointer' }}
            type='checkbox'
            onChange={(e) => {
              const eventName = e.target.checked
                ? 'fm-select-all'
                : 'fm-deselect-all';
              window.dispatchEvent(new Event(eventName));
            }}
          />
          {/* <label className='mb-0'> */}
          <div style={{ marginRight: '6px' }}>انتخاب همه</div>
          {/* </label> */}
        </div>
        {/* <span className={styles['bread-crumb__your-path']}>مسیر شما: </span> */}
        <span
          className={classnames(
            styles['bread-crumb__item'],
            styles['bread-crumb__item--title']
          )}
          onClick={() => {
            // for after search with click go to file tab
            if (TabTypes.SearchList) setSearchText('');

            if (currentTab !== TabTypes.FileList) {
              setCurrentTab(TabTypes.FileList);
            }

            setCurrentHash( defaultDirectory ? defaultDirectory :'root');
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
                className={classnames(
                  utilStyles['px-2'],
                  styles['bread-crumb__item--icon']
                )}
              />
              <span className={styles['bread-crumb__item--title']}>
                {item?.name}
              </span>
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
