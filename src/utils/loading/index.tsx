import styles from './style.module.scss';

import React from 'react';
import classnames from 'classnames';
import { getBs } from '../../utils/index';

interface IProps {
  wholePage?: boolean;
}

export const Loading: React.FunctionComponent<IProps> = ({
  wholePage = false
}) => {
  return (
    <div className={classnames({ [styles['center-page']]: wholePage })}>
      <div className={`${styles['flow']} ${getBs()['mx-auto']}`}>
        <div className={`${styles['flow-dot']}`}></div>
        <div className={`${styles['flow-dot']}`}></div>
        <div className={`${styles['flow-dot']}`}></div>
      </div>
    </div>
  );
};
