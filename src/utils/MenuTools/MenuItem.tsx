import styles from './style.module.scss';

import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FontAwesomeIconTypes from '@fortawesome/fontawesome-common-types';
import { OperationTypes } from '../../config/types';
import { getBs } from '../../utils/index';
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
        cssModule={getBs()}
        role='button'
        tag={type === OperationTypes.Download ? 'a' : undefined}
        onClick={clickHandler}
        target='_blank'
        className={`${styles['dropdown-menu-wrapper__item']}`}
      >
        <FontAwesomeIcon icon={icon} className={getBs()['ml-1']} />
        <span>{title}</span>
        {enTitle ? <span className={getBs()['me-auto']}>{enTitle}</span> : ''}
      </DropdownItem>
    </React.Fragment>
  );
};

export default MenuItem;
