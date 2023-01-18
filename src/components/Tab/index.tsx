import React, { FunctionComponent, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import Search from '../Search/index';
import StateColumnList from '../StateColumnList/index';
import FileTab from '../FileTab/index';
import Upload from '../upload';
import ArchiveTab from '../ArchiveTab';
import BreadCrumb from '../BreadCrumb/';
import SortingMenu from '../sortingMenu/';

interface Props {}

const Tab: FunctionComponent<Props> = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTab = (tab: number) => setActiveTab(tab);
  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink active={activeTab === 1} onClick={() => handleTab(1)}>
            فایل ها
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === 2} onClick={() => handleTab(2)}>
            آرشیو
          </NavLink>
        </NavItem>
        <NavItem className='menu-items'>
          <Search />
          <StateColumnList />
          <Upload />
        </NavItem>
      </Nav>
      <SortingMenu />
      <TabContent activeTab={activeTab}>
        <TabPane tabId={1}>
          <FileTab />
        </TabPane>
        <TabPane tabId={2}>{activeTab === 2 ? <ArchiveTab /> : ''}</TabPane>
      </TabContent>
      <BreadCrumb />
    </div>
  );
};

export default Tab;
