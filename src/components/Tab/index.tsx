import styles from './style.module.scss';
import utilsStyles from '../../sass/style.module.scss';

import React, {
  useEffect,
  FunctionComponent,
  useState,
  useContext,
  useRef
} from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classNames from 'classnames';

import { getBs } from '../../utils/index';
import Search from '../Search/index';
import StateColumnList from '../StateColumnList/index';
import FileTab from '../FileTab/index';
import Upload from '../upload';
import ArchiveTab from '../ArchiveTab';
import BreadCrumb from '../BreadCrumb/';
import SortingMenu from '../sortingMenu/';
import { TabTypes } from '../../config/types';
import { Context } from '../../store/index';
import { PAGE_SIZE } from '../../config/config';
import SearchTab from '../SearchTab';
import CheckPermissions from '../CheckPermissions';

interface Props {}

const Tab: FunctionComponent<Props> = () => {
  // const [activeTab, setActiveTab] = useState(TabTypes.FileList);

  const { config, setCurrentTab, currentTab, searchText } = useContext(Context);

  // const total = useRef<{ archive: number; file: number }>({archive:0, file:0});
  const total = useRef<number>(0);

  const handleTab = (tab: number) => {
    setCurrentTab(tab);
    // setActiveTab(tab);
  };

  const setTotal = (val) => (total.current = val);

  useEffect(() => {
    // if type in input search deselect another tabs
    if (searchText) {
      handleTab(TabTypes.SearchList);
      setCurrentTab(TabTypes.SearchList);
    } else {
      handleTab(TabTypes.FileList);
      setCurrentTab(TabTypes.FileList);
    }
  }, [searchText]);

  return (
    <div>
      <Nav
        tabs
        className={`${styles['fix-top']} ${styles['nav-wrapper']}`}
        cssModule={getBs()}
      >
        <NavItem
          cssModule={getBs()}
          className={`${styles['nav-wrapper__tab-item']} ${styles['nav-wrapper__item']}`}
        >
          <NavLink
            // disabled={activeTab === TabTypes.SearchList}
            active={currentTab === TabTypes.FileList}
            onClick={() => handleTab(TabTypes.FileList)}
            className={classNames(
              styles['nav-wrapper__link'],
              {
                [styles['nav-wrapper__tab-item--active']]:
                  currentTab === TabTypes.FileList
              },
              {
                [styles['nav-wrapper__tab-item--disabled']]:
                  currentTab === TabTypes.SearchList
              }
            )}
            cssModule={getBs()}
          >
            فایل ها
          </NavLink>
        </NavItem>
        <NavItem
          cssModule={getBs()}
          className={`${styles['nav-wrapper__tab-item']} ${styles['nav-wrapper__item']}`}
        >
          <NavLink
            // disabled={activeTab === TabTypes.SearchList}
            active={currentTab === TabTypes.ArchiveList}
            onClick={() => handleTab(TabTypes.ArchiveList)}
            className={classNames(
              styles['nav-wrapper__link'],
              {
                [styles['nav-wrapper__tab-item--active']]:
                  currentTab === TabTypes.ArchiveList
              },
              {
                [styles['nav-wrapper__tab-item--disabeld']]:
                  currentTab === TabTypes.SearchList
              }
            )}
            cssModule={getBs()}
          >
            آرشیو
          </NavLink>
        </NavItem>
        <NavItem
          className={`${styles['nav-wrapper__container']} ${styles['nav-wrapper__item']}`}
          cssModule={getBs()}
        >
          <Search />
          <span className={utilsStyles['d-flex']}>
            <StateColumnList />
            <Upload />
          </span>
        </NavItem>
      </Nav>
      <SortingMenu />
      <TabContent
        activeTab={currentTab}
        style={{ marginTop: 0, overflow: 'scroll', border: 'none' }}
        cssModule={getBs()}
      >
        <TabPane
          tabId={TabTypes.FileList}
          style={{ height: config?.height }}
          cssModule={getBs()}
        >
          <CheckPermissions permissions={['folder_children']} showMessage>
            <FileTab setTotal={setTotal} />
          </CheckPermissions>
        </TabPane>
        <TabPane
          cssModule={getBs()}
          tabId={TabTypes.ArchiveList}
          style={{ height: config?.height }}
        >
          {currentTab === TabTypes.ArchiveList ? (
            <CheckPermissions permissions={['archive_list']} showMessage>
              <ArchiveTab />
            </CheckPermissions>
          ) : (
            ''
          )}
        </TabPane>
        <TabPane
          cssModule={getBs()}
          tabId={TabTypes.SearchList}
          style={{ height: config?.height }}
        >
          {currentTab === TabTypes.SearchList ? <SearchTab /> : ''}
        </TabPane>
      </TabContent>
      <BreadCrumb />
    </div>
  );
};

export default Tab;
