import styles from './style.module.scss';
import utilStyles from "../../sass/style.module.scss";

import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';
import classnames from 'classnames';
import { TabTypes } from '../../config/types';

const index = () => {
  const {
    breadCrumb,
    setCurrentHash,
    currentTab,
    setCurrentTab,
    setSearchText
  } = useContext(Context);

  return (
    <div className={styles['bread-crumb']}>
      <div>
        <span className={styles['bread-crumb__your-path']}>مسیر شما: </span>
        <span
          className={styles['bread-crumb__item']}
          onClick={() => {
            // for after search with click go to file tab
            if (TabTypes.SearchList) {
              setSearchText('');
            }
            setCurrentHash('root');
          }}
        >
          همه فایل ها{' '}
        </span>
        {breadCrumb.reverse().map((item, index) => (
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
              if (TabTypes.SearchList) {
                setSearchText('');
              }
              item?.disabled ? null : setCurrentHash(item.hash);
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} className={utilStyles['px-2']} />
            <span>{item?.name}</span>
          </span>
        ))}
      </div>
      <div className={styles['bread-crumb__copyright']}>copy right</div>
    </div>
  );
};

export default index;
