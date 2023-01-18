import { createContext } from 'react';

export interface AppContextInterface {
  isList: boolean;
  setIsList: (isList: boolean) => void;

  breadCrumb: any;
  setBreadCrumb: (breadCrumbArray: []) => void;

  currentHash: string;
  setCurrentHash: (hash: string) => void;

  itemHash: string | undefined;
  setItemHash: (hash: string | undefined) => void;

  operationType: number | null;
  setOperationType: (operationType: number) => void;
}

export const Context = createContext<AppContextInterface>(
  {} as AppContextInterface
);
