import React, { FunctionComponent} from 'react'
import { InputGroup, InputGroupText, Input } from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

interface Props{

}
const Search:FunctionComponent<Props> = () => {
  return <InputGroup>
    <InputGroupText>
      <FontAwesomeIcon icon={faSearch} />
    </InputGroupText>
    <Input />
  </InputGroup>
}

export default Search
