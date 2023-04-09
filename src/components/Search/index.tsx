import React, { FunctionComponent, useState } from 'react';
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Props {
  setSearchText: (string) => void;
}
const Search: FunctionComponent<Props> = ({ setSearchText }) => {
  
  return (
    <InputGroup>
      <InputGroupText>
        <FontAwesomeIcon icon={faSearch} />
      </InputGroupText>
      <Input
        onChange={(event) => {
          const { value } = event.target;
          setSearchText(value);
        }}
      />
    </InputGroup>
  );
};

export default Search;
