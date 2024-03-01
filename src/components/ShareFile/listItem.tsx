import styles from './style.module.scss';

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { getBs } from '../../utils/index';
import classNames from 'classnames';

import { IconTimsFill } from '../../utils/icons';

interface IPprops {
  name: string;
  img: string | undefined;
  date: string | undefined;
}
const ListItem: React.FC<IPprops> = ({
  name,
  img = undefined,
  date = undefined
}) => {

  return (
    <div className={styles['list-wrapper__item']}>
      <div
        className={classNames(getBs()['d-flex'], getBs()['align-items-center'])}
      >
        {img ? (
          <img src={img} className={styles['list-wrapper__img']} />
        ) : (
          <FontAwesomeIcon
            icon={faUserCircle}
            className={styles['list-wrapper__icon-user']}
            size='2x'
            color='gray'
          />
        )}
        <div className={classNames(getBs()['mr-2'])}>
          <div className={styles['list-wrapper__name']}>{name}</div>
          <div className={styles['list-wrapper__date']}>
            <span>تاریخ انقضا</span>: <span>10/2/1402</span>
          </div>
        </div>
      </div>
      <div className={styles['list-wrapper__icons']} >
        <IconTimsFill style={{ width: 20, height: 20 }} role="button" />
        {/* <FontAwesomeIcon
          icon={faTimesCircle}
          className={styles['list-wrapper__icon-times']}
        /> */}
      </div>
    </div>
  );
};

export default ListItem;
