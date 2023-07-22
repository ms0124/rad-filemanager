import 'react-toastify/dist/ReactToastify.css';

import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import './sass/style.module.scss';
import App from './components/FileManager/index';
import { Context, AppContextInterface } from './store/index';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './config/config';
import { ToastContainer } from 'react-toastify';
import WithAxios from './utils/WithAxios';
interface Props {
  clientId: string;
  accessToken: string;
  config: {
    height?: string;
  };
  permissions: string[];
  onSelect?: any;
  isSandbox: boolean;
}

const FileManagerReact = ({ ...props }: Props) => {
  const [isList, setIsList] = useState<boolean>(true);
  const [breadCrumb, setBreadCrumb] = useState<[]>([]);
  const [currentHash, setCurrentHash] = useState<string>('root');
  const [itemHash, setItemHash] = useState<string>('');
  const [operationType, setOperationType] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [permissions, setPermissions] = useState<string[]>(props.permissions);
  const [onSelect, setOnSelect] = useState(() => props.onSelect);
  const [isSandbox, setIsSandbox] = useState<boolean>(props?.isSandbox);
  const [config, setConfig] = useState<any>(props.config);
  const [header, setHeader] = useState<any>({
    clientId: props.clientId,
    accessToken: props.accessToken
  });

  useEffect(() => {
    setHeader({ clientId: props.clientId, accessToken: props.accessToken });
  }, [props.accessToken]);

  const defaultValues: AppContextInterface = {
    isList,
    setIsList,
    breadCrumb,
    setBreadCrumb,
    currentHash,
    setCurrentHash,
    itemHash,
    setItemHash,
    operationType,
    setOperationType,
    currentTab,
    setCurrentTab,
    searchText,
    setSearchText,

    permissions,
    config,
    header,
    onSelect,
    isSandbox
  };
  return (
    <Context.Provider value={defaultValues}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer position='bottom-left' rtl />
        <WithAxios>
          <App />
        </WithAxios>
      </QueryClientProvider>
    </Context.Provider>
  );
};

function FileManager(props: any, elementId: any) {
  const [isList, setIsList] = useState<boolean>(true);
  const [breadCrumb, setBreadCrumb] = useState<[]>([]);
  const [currentHash, setCurrentHash] = useState<string>('root');
  const [itemHash, setItemHash] = useState<string>('');
  const [operationType, setOperationType] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [permissions, setPermissions] = useState<string[]>(props.permissions);

  const [config, setConfig] = useState<any>(props.config);
  const [header, setHeader] = useState<any>({
    clientId: props.clientId,
    accessToken: props.accessToken
  });
  const [onSelect, setOnSelect] = useState(() => props.onSelect);
  const [isSandbox, setIsSandbox] = useState<boolean>(props?.isSandbox);

  useEffect(() => {
    setHeader({ clientId: props.clientId, accessToken: props.accessToken });
  }, [props.accessToken]);

  const defaultValues: AppContextInterface = {
    isList,
    setIsList,
    breadCrumb,
    setBreadCrumb,
    currentHash,
    setCurrentHash,
    itemHash,
    setItemHash,
    operationType,
    setOperationType,
    currentTab,
    setCurrentTab,
    searchText,
    setSearchText,

    permissions,
    config,
    header,
    onSelect,
    isSandbox
  };
  ReactDOM.render(
    <Context.Provider value={defaultValues}>
      <QueryClientProvider client={queryClient}>
        <WithAxios>
          <App {...props} />
        </WithAxios>
      </QueryClientProvider>
    </Context.Provider>,
    document.getElementById(elementId)
  );
}

(window as any).FileManager = FileManager;

export { FileManager, FileManagerReact };
