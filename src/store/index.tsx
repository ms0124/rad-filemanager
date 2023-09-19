import { createContext } from 'react';

export interface AppContextInterface {
  isList: boolean;
  setIsList: (isList: boolean) => void;

  breadCrumb: any;
  setBreadCrumb: (breadCrumbArray: any) => void;

  currentHash: string; // hash folder
  setCurrentHash: (hash: string) => void;

  itemHash: string;
  setItemHash: (hash: string) => void;

  operationType: number | null;
  setOperationType: (operationType: number) => void;

  currentTab: number;
  setCurrentTab: (tabType: number) => void;

  searchText: string;
  setSearchText: (searchText: string) => void;

  permissions: string[];

  header: { clientId: string; accessToken: string };

  config?: { width: number; height: number } | null;
  onSelect?: (data: any) => void;

  isSandbox: boolean;

  isShowCheckbox: boolean;
  setIsShowCheckbox: (isShowCheckbox: boolean) => void;

  selectedItems: { hash: string; name: string }[];
  setSelectedItems: (data: any) => void;

  orderBy: string;
  setOrderBy: (name: string) => void;

  desc: boolean;
  setDesc: (isDesc:boolean) => void;
}

export const Context = createContext<AppContextInterface>(
  {} as AppContextInterface
);
