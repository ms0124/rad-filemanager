import styles from './style.module.scss';

import React, { FunctionComponent, useState } from 'react';
import {
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { getBs } from '../../utils/index';
import UserStorage from './UserStorage';

interface SortingMenuItemProps {
  name: string;
  isUp: boolean;
  handleSort: () => void;
}

const SortingMenuItem: FunctionComponent<SortingMenuItemProps> = ({
  isUp,
  name,
  handleSort
}) => {
  return (
    <NavItem
      cssModule={getBs()}
      className={classNames(styles['sorting-menu__arrange'], {
        [styles['sorting-menu__arrange--up']]: isUp
      })}
      onClick={handleSort}
    >
      <span>{name}</span>
      {isUp ? (
        <FontAwesomeIcon icon={faSortUp} className={getBs()['me-2']} />
      ) : (
        <FontAwesomeIcon icon={faSortDown} className={getBs()['me-2']} />
      )}
    </NavItem>
  );
};

interface DropDownElementProps {
  isOpen: boolean;
  toggle: () => void;
}

const DropDownElement: FunctionComponent<DropDownElementProps> = ({
  isOpen,
  toggle
}) => {
  return (
    <Dropdown
      cssModule={getBs()}
      isOpen={isOpen}
      toggle={toggle}
      className={styles['sort-dropdown']}
    >
      <DropdownToggle color='none' cssModule={getBs()}>
        نام
        <FontAwesomeIcon icon={faAngleDown} className={styles['me-2']} />
      </DropdownToggle>
      <DropdownMenu end={true} container='body' cssModule={getBs()}>
        <DropdownItem
          cssModule={getBs()}
          className={styles['sort-dropdown__item']}
          onClick={() => toggle}
        >
          پوشه ها
        </DropdownItem>
        <DropdownItem
          cssModule={getBs()}
          className={styles['sort-dropdown__item']}
          onClick={() => toggle}
        >
          فایل ها
        </DropdownItem>
        <DropdownItem
          cssModule={getBs()}
          className={styles['sort-dropdown__item']}
          onClick={() => toggle}
        >
          عکس ها
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

const SortingMenu: FunctionComponent = () => {
  const [sort, setSort] = useState({
    byName: false,
    byDate: false,
    bySize: false
  });
  const [dropDowmIsOpen, setDropDowmIsOpen] = useState(false);

  const handleSortByName = () =>
    setSort((prev) => ({ ...prev, byName: !prev.byName }));

  const handleSortByDate = () =>
    setSort((prev) => ({ ...prev, byDate: !prev.byDate }));

  const handleSortBySize = () =>
    setSort((prev) => ({ ...prev, bySize: !prev.bySize }));

  const handleToggle = () => {
    setDropDowmIsOpen((isOpen) => !isOpen);
  };
  
  return (
    <div className={classNames(styles['sorting-menu'])}>
      <Nav cssModule={getBs()} style={{ alignItems: 'center' }}>
        <NavItem cssModule={getBs()}>
          <FontAwesomeIcon icon={faSort} />
          <span
            className={classNames(
              getBs()['me-2'],
              styles['sorting-menu__text']
            )}
          >
            ترتیب بر اساس
          </span>
        </NavItem>
        <SortingMenuItem
          isUp={sort.byName}
          name='نام'
          handleSort={handleSortByName}
        />
        <SortingMenuItem
          isUp={sort.byDate}
          name='تاریخ'
          handleSort={handleSortByDate}
        />
        <SortingMenuItem
          isUp={sort.bySize}
          name='سایز'
          handleSort={handleSortBySize}
        />
        <NavItem
          cssModule={getBs()}
          className={classNames(
            styles['divider-vertical'],
            styles['sorting-menu__divider']
          )}
        />
        <NavItem cssModule={getBs()}>نوع فایل</NavItem>
        <DropDownElement isOpen={dropDowmIsOpen} toggle={handleToggle} />
        <NavItem
          cssModule={getBs()}
          className={classNames(
            styles['divider-vertical'],
            styles['sorting-menu__divider']
          )}
        />
        { console.log(  getBs()['pt-0'],
            getBs()['mr-auto'],
            getBs()['ms-2'])
        }
        <NavItem
          cssModule={getBs()}
          className={classNames(
            getBs()['pt-0'],
            getBs()['mr-auto'],
            getBs()['pl-4']
          )}
        >
          <UserStorage />
        </NavItem>
      </Nav>
    </div>
  );
};
export default SortingMenu;
