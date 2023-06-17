import styles from './style.module.scss';
import utilStyles from '../../../sass/style.module.scss';
import emptyFolder from './empty_folder.png';
import { RightClick } from '../../../utils';

import React, { FunctionComponent } from 'react';

interface IProps {
  text?: string;
}

const Empty: FunctionComponent<IProps> = ({ text = '' }) => {
  return (
    <React.Fragment>
      <RightClick query='#rightclick' />
      <div id='rightclick' className={styles['empty']}>
        {text ? (
          text
        ) : (
          <div
            className={styles['empty__container']}
          >
            <img src={emptyFolder} width={60} height={40} className={utilStyles['mb-2']} />
            <span>این پوشه خالیست!</span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Empty;
