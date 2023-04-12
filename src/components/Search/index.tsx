import React, { FunctionComponent, useState, useContext } from 'react';
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Context } from '../../store/index';

interface Props {}

const Search: FunctionComponent<Props> = () => {
  const { setSearchText, searchText } = useContext(Context);

  return (
    <InputGroup>
      <InputGroupText>
        <FontAwesomeIcon icon={faSearch} />
      </InputGroupText>
      <Input
        value={searchText}
        onChange={(event) => {
          const { value } = event.target;
          setSearchText(value);
        }}
      />
    </InputGroup>
  );
};

export default Search;
