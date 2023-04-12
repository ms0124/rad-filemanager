import './style.scss';
import { RightClick } from '../../../utils';

import React, { FunctionComponent } from 'react';

interface IProps {
  text?: string;
}

const Empty: FunctionComponent<IProps> = ({ text = '' }) => {
  return (
    <React.Fragment>
      <RightClick query='.empty' />
      <div className='empty'>{text ? text : 'این پوشه خالیست!'}</div>
    </React.Fragment>
  );
};

export default Empty;
