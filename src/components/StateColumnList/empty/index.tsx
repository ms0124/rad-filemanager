import styles from './style.module.scss';
import { RightClick } from '../../../utils';

import React, { FunctionComponent } from 'react';

interface IProps {
  text?: string;
}

const Empty: FunctionComponent<IProps> = ({ text = '' }) => {
  return (
    <React.Fragment>
      <RightClick query='#rightclick' />
      <div id="rightclick" className={styles['empty']}>{text ? text : 'این پوشه خالیست!'}</div>
    </React.Fragment>
  );
};

export default Empty;
