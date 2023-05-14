import styles from './style.module.scss';

import React, { FunctionComponent, useState, useContext } from 'react';
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';
import CheckPermissions from '../CheckPermissions';
import { getBs } from '../../utils/index';

interface Props {}

const Search: FunctionComponent<Props> = () => {
  const { setSearchText, searchText } = useContext(Context);

  return (
    <CheckPermissions permissions={['search']}>
      <InputGroup
        className={styles['search-wrapper']}
        cssModule={getBs()}
        style={{
          width: 'auto'
        }}
      >
        <InputGroupText
          cssModule={getBs()}
          className={styles['search-wrapper__icon']}
        >
          <FontAwesomeIcon icon={faSearch} />
        </InputGroupText>
        <Input
          cssModule={getBs()}
          value={searchText}
          className={styles['search-wrapper__input']}
          onChange={(event) => {
            const { value } = event.target;
            setSearchText(value);
          }}
        />
      </InputGroup>
    </CheckPermissions>
  );
};

export default Search;
