import styles from './style.module.scss';

import React, { useContext } from 'react';

import { Context } from '../../store/index';
import { IconTimes } from '../../utils/icons';
import classNames from 'classnames';

const Selected = () => {
  const { selectedItems , setSelectedItems } = useContext(Context);
  const handleRemoveItem = (item) => {
    const filteredItems = selectedItems.filter(x => x.hash !== item.hash);
    setSelectedItems(filteredItems);
  }
  if(!selectedItems.length) return null
  return (
    <div className={classNames(styles['container'])}>
      <h4 className={classNames(styles['title'])}>فایل های انتخاب شده({selectedItems?.length})</h4>
      <div className={classNames(styles['selected-wrapper'])}>
      {selectedItems.map((x) => (
        <div className={classNames(styles['selected-wrapper__item'])}>
          <span>{x.name}</span>
          <IconTimes style={{ cursor: 'pointer', marginRight: '15px' }} onClick={()=> handleRemoveItem(x)} />
        </div>
      ))}
        </div>
    </div>
  );
};

export default Selected;
