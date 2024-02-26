import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import React from 'react';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FontAwesomeIconTypes from '@fortawesome/fontawesome-common-types';
import { OperationTypes } from '../../config/types';
import { getBs } from '../../utils/index';
import classNames from 'classnames';
interface IProps {
  fontAwesomeIcon?: FontAwesomeIconTypes.IconDefinition;
  icon?: React.ReactElement;
  title: string;
  enTitle?: string;
  clickHandler: () => void;
  type?: number;
  disabled?: boolean;
}

const MenuItem: React.FunctionComponent<IProps> = ({
  icon,
  title,
  enTitle,
  fontAwesomeIcon,
  clickHandler,
  type,
  disabled = false
}) => {
  return (
    <React.Fragment>
      <DropdownItem
        cssModule={getBs()}
        role='button'
        tag={type === OperationTypes.Download ? 'a' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (disabled) return;
          clickHandler();
        }}
        target='_blank'
        className={`${styles['dropdown-menu-wrapper__item']} 222`}
        style={
          disabled
            ? { cursor: 'not-allowed', backgroundColor: 'transparent' }
            : {}
        }
      >
        {fontAwesomeIcon ? (
          <FontAwesomeIcon
            icon={fontAwesomeIcon}
            className={utilStyles['ms-1']}
          />
        ) : (
          icon
        )}
        <span className={classNames(styles['dropdown-menu-wrapper__title'])} >{title}</span>
        {enTitle ? (
          <span
            className={`${utilStyles['me-auto']} ${styles['dropdown-menu-wrapper__title-en']}`}
          >
            {enTitle}
          </span>
        ) : (
          ''
        )}
      </DropdownItem>
    </React.Fragment>
  );
};

export default MenuItem;
