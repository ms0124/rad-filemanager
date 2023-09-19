import styles from './style.module.scss';
import utilStyles from '../../sass/style.module.scss';

import utilsStyles from '../../sass/style.module.scss';
import React, { FunctionComponent, useContext, useState } from 'react';
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
import { IconMultiSelect } from '../../utils/icons';
import { Context } from '../../store/index';
import { OrderByTypes } from '../../config/types';
interface SortingMenuItemProps {
  name: string;
  order: string;
  orderName: string;
  desc: boolean;
  handleOrderBy: (name: string, desc: boolean) => void;
}

const SortingMenuItem: FunctionComponent<SortingMenuItemProps> = ({
  name,
  order,
  orderName,
  desc,
  handleOrderBy
}) => {
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  return (
    <NavItem
      cssModule={getBs()}
      className={classNames(styles['sorting-menu__arrange'], {
        [styles['sorting-menu__arrange--up']]: order === orderName
      })}
      onClick={() => {
        if (!isFirstTime) setIsFirstTime(true);
        handleOrderBy(orderName, isFirstTime ? true : !desc);
      }}
    >
      <span>{name}</span>

      {order === orderName ? (
        !desc ? (
          <FontAwesomeIcon icon={faSortUp} className={utilStyles['me-2']} />
        ) : (
          <FontAwesomeIcon icon={faSortDown} className={utilStyles['me-2']} />
        )
      ) : (
        ''
      )}
    </NavItem>
  );
};

// interface DropDownElementProps {
//   isOpen: boolean;
//   toggle: () => void;
// }

// const DropDownElement: FunctionComponent<DropDownElementProps> = ({
//   isOpen,
//   toggle
// }) => {
//   return (
//     <Dropdown
//       cssModule={getBs()}
//       isOpen={isOpen}
//       toggle={toggle}
//       className={styles['sort-dropdown']}
//     >
//       <DropdownToggle color='none' cssModule={getBs()}>
//         نام
//         <FontAwesomeIcon icon={faAngleDown} className={utilStyles['me-2']} />
//       </DropdownToggle>
//       <DropdownMenu end={true} container='body' cssModule={getBs()}>
//         <DropdownItem
//           cssModule={getBs()}
//           className={styles['sort-dropdown__item']}
//           onClick={() => toggle}
//         >
//           پوشه ها
//         </DropdownItem>
//         <DropdownItem
//           cssModule={getBs()}
//           className={styles['sort-dropdown__item']}
//           onClick={() => toggle}
//         >
//           فایل ها
//         </DropdownItem>
//         <DropdownItem
//           cssModule={getBs()}
//           className={styles['sort-dropdown__item']}
//           onClick={() => toggle}
//         >
//           عکس ها
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

const SortingMenu: FunctionComponent = () => {
  const {
    isShowCheckbox,
    setIsShowCheckbox,
    setSelectedItems,
    orderBy,
    setOrderBy,
    desc,
    setDesc
  } = useContext(Context);

  // const [sort, setSort] = useState({
  //   byName: false,
  //   byDate: false,
  //   bySize: false
  // });
  // const [dropDowmIsOpen, setDropDowmIsOpen] = useState(false);

  // const handleSortByName = () =>
  //   setSort((prev) => ({ ...prev, byName: !prev.byName }));

  // const handleSortByDate = () =>
  //   setSort((prev) => ({ ...prev, byDate: !prev.byDate }));

  // const handleSortBySize = () =>
  //   setSort((prev) => ({ ...prev, bySize: !prev.bySize }));

  // const handleToggle = () => {
  //   setDropDowmIsOpen((isOpen) => !isOpen);
  // };
  const handleOrderBy = (name, isDesc) => {
    console.log({ isDesc, desc });

    setDesc(isDesc);
    setOrderBy(name);
  };
  const handleChangeShowCheckbox = () => {
    if (isShowCheckbox) {
      setIsShowCheckbox(false);
      // unselect all selectedItems
      setSelectedItems([]);
    } else {
      setIsShowCheckbox(true);
    }
  };

  return (
    <div className={classNames(styles['sorting-menu'])}>
      <Nav cssModule={getBs()} style={{ alignItems: 'center' }}>
        <NavItem cssModule={getBs()}>
          <FontAwesomeIcon icon={faSort} />
          <span
            className={classNames(
              utilsStyles['me-2'],
              styles['sorting-menu__text']
            )}
          >
            ترتیب بر اساس
          </span>
        </NavItem>
        <SortingMenuItem
          desc={desc}
          order={orderBy}
          orderName={OrderByTypes.Name}
          name='نام'
          handleOrderBy={handleOrderBy}
        />
        <SortingMenuItem
          desc={desc}
          order={orderBy}
          orderName={OrderByTypes.Updated}
          name='تاریخ'
          handleOrderBy={handleOrderBy}
        />
        <SortingMenuItem
          desc={desc}
          order={orderBy}
          orderName={OrderByTypes.Size}
          name='سایز'
          handleOrderBy={handleOrderBy}
        />
        <NavItem
          cssModule={getBs()}
          className={classNames(
            styles['divider-vertical'],
            styles['sorting-menu__divider']
          )}
        />

        {/* <NavItem cssModule={getBs()}>نوع فایل</NavItem>
        <DropDownElement isOpen={dropDowmIsOpen} toggle={handleToggle} /> */}
        <NavItem
          cssModule={getBs()}
          className={classNames(
            styles['divider-vertical'],
            styles['sorting-menu__divider']
          )}
        />
        <NavItem role='button' className={classNames(utilsStyles['me-auto'])}>
          <div
            style={{
              border: isShowCheckbox
                ? '1px solid #ff9b3f'
                : '1px solid #c5c5c5',
              marginLeft: '15px',
              borderRadius: '4px',
              padding: '2px 5px 1px 5px'
            }}
            onClick={handleChangeShowCheckbox}
          >
            <IconMultiSelect />
            <span style={{ color: isShowCheckbox ? '#ff9b3f' : '' }}>
              چند انتخابی
            </span>
          </div>
        </NavItem>
        <NavItem
          cssModule={getBs()}
          className={classNames(utilsStyles['pt-0'], utilsStyles['ps-4'])}
        >
          <UserStorage />
        </NavItem>
      </Nav>
    </div>
  );
};
export default SortingMenu;
