import './style.scss';

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
      className={classNames('sorting-menu__arrange', {
        'sorting-menu__arrange--up': isUp
      })}
      onClick={handleSort}
    >
      <span>{name}</span>
      {isUp ? (
        <FontAwesomeIcon icon={faSortUp} className='me-2' />
      ) : (
        <FontAwesomeIcon icon={faSortDown} className='me-2' />
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
    <Dropdown isOpen={isOpen} toggle={toggle} className='sort-dropdown'>
      <DropdownToggle color='none'>
        نام
        <FontAwesomeIcon icon={faAngleDown} className='me-2' />
      </DropdownToggle>
      <DropdownMenu end={true} container='body'>
        <DropdownItem className='sort-dropdown__item' onClick={() => toggle}>
          پوشه ها
        </DropdownItem>
        <DropdownItem className='sort-dropdown__item' onClick={() => toggle}>
          فایل ها
        </DropdownItem>
        <DropdownItem className='sort-dropdown__item' onClick={() => toggle}>
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
    <div className='sorting-menu fix-top' style={{ top: 62 }}>
      <Nav>
        <NavItem>
          <FontAwesomeIcon icon={faSort} />
          <span className='me-2 sorting-menu__text'>ترتیب بر اساس</span>
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
        <NavItem className='divider-vertical sorting-menu__divider' />
        <NavItem>نوع فایل</NavItem>
        <DropDownElement isOpen={dropDowmIsOpen} toggle={handleToggle} />
        <NavItem className='divider-vertical sorting-menu__divider' />
        <NavItem className='pt-0 me-auto ms-2'>
          <UserStorage />
        </NavItem>
      </Nav>
    </div>
  );
};
export default SortingMenu;
