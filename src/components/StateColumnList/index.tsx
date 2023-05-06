import styles from './style.module.scss';

import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';

const StateColumnList = () => {
  const { isList, setIsList } = useContext(Context);

  const handleClick = (state: boolean): void => {
    setIsList(state);
  };

  return (
    <span className={styles['state-column-list']}>
      <span>شیوه نمایش</span>
      <FontAwesomeIcon
        icon={faColumns}
        size='2x'
        className={styles['state-column-list__column']}
        onClick={() => handleClick(true)}
      />
      <FontAwesomeIcon
        icon={faListAlt}
        size='2x'
        className={styles['state-column-list__list']}
        onClick={() => handleClick(false)}
      />
    </span>
  );
};

export default StateColumnList;
