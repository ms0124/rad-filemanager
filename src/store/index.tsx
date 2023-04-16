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
}

export const Context = createContext<AppContextInterface>(
  {} as AppContextInterface
);
