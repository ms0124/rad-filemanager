import styles from './style.module.scss';

import React, { useEffect, useState } from 'react';
import moment from 'moment-jalaali';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { getBs } from '../../utils/index';
import classNames from 'classnames';

import { IconTimsFill } from '../../utils/icons';

interface IPprops {
  name: string;
  img: string | undefined;
  date: string | undefined;
  deleteShareHandler: (identity: string) => void;
  isLoading: boolean;
}
const ListItem: React.FC<IPprops> = ({
  name,
  img = undefined,
  date = undefined,
  deleteShareHandler,
  isLoading
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading == false && loading == true) setLoading(false);
  }, [isLoading]);
  return (
    <div className={styles['list-wrapper__item']}>
      <div
        className={classNames(getBs()['d-flex'], getBs()['align-items-center'])}
      >
        {img ? (
          <img
            width={35}
            height={35}
            src={img}
            className={classNames(
              styles['list-wrapper__img'],
              getBs()['rounded-circle']
            )}
          />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            className={styles['list-wrapper__icon-user']}
            size='2x'
            color='gray'
          />
        )}
        <div className={classNames(getBs()['mr-2'])}>
          <div className={styles['list-wrapper__name']}>
            {name ? name : 'بدون نام'}
          </div>
          <div className={styles['list-wrapper__date']}>
            <span>تاریخ انقضا</span>:{' '}
            <span>{date ? moment(date).format('jYYYY/jMM/jDD') : ''}</span>
          </div>
        </div>
      </div>
      <div
        className={styles['list-wrapper__icons']}
        onClick={() => {
          setLoading(true);
          deleteShareHandler(name);
        }}
      >
        {loading ? (
          <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />
        ) : (
          <IconTimsFill style={{ width: 20, height: 20 }} role='button' />
        )}
        {/* <FontAwesomeIcon
          icon={faTimesCircle}
          className={styles['list-wrapper__icon-times']}
        /> */}
      </div>
    </div>
  );
};

export default ListItem;
