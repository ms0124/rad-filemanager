import './style.scss';

import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';

const index = () => {

  const { breadCrumb, setCurrentHash } = useContext(Context);
  
  return (
    <div className='bread-crumb'>
      <div>
        <span className='bread-crumb__your-path'>مسیر شما: </span>
        <span className='bread-crumb__item' onClick={()=> setCurrentHash('root')}>همه فایل ها </span>
        {breadCrumb.reverse().map((item, index) => <span className='bread-crumb__item' key={index} onClick={()=> setCurrentHash(item.hash)}>
          <FontAwesomeIcon icon={faAngleLeft} className='px-2' />
          <span>{item?.name}</span>
        </span>)}
      </div>
      <div className='bread-crumb__copyright'>copy right</div>
    </div>
  );
};

export default index;
