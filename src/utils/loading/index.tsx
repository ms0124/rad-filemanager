import './style.scss';

import React from 'react';
import classnames from 'classnames';
interface IProps {
  wholePage?: boolean;
}

export const Loading: React.FunctionComponent<IProps> = ({
  wholePage = false
}) => {
  return (
    <div className={classnames({ 'center-page': wholePage })}>
      <div className='flow mx-auto'>
        <div className='flow-dot'></div>
        <div className='flow-dot'></div>
        <div className='flow-dot'></div>
      </div>
      ;
    </div>
  );
};
