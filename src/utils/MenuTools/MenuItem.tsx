import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FontAwesomeIconTypes from '@fortawesome/fontawesome-common-types';
import { OperationTypes } from '../../config/types';

interface IProps {
  icon: FontAwesomeIconTypes.IconDefinition;
  title: string;
  enTitle?: string;
  clickHandler?: () => void;
  type?: number;
}

const MenuItem: React.FunctionComponent<IProps> = ({
  icon,
  title,
  enTitle,
  clickHandler,
  type
}) => {
  return (
    <React.Fragment>
      <DropdownItem
        tag={type === OperationTypes.Download ? 'a' : undefined}
        onClick={clickHandler}
        target="_blank"
        className='dropdown-menu-wrapper__item'
      >
        <FontAwesomeIcon icon={icon} className='ml-1' />
        <span>{title}</span>
        {enTitle ? <span className='me-auto'>{enTitle}</span> : ''}
      </DropdownItem>
    </React.Fragment>
  );
};

export default MenuItem;
