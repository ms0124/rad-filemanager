import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import './sass/style.scss';
import App from './components/FileManager/index';
import { Context, AppContextInterface } from './store/index';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './config/config';
interface Props {
  header: {
    clientId: string;
    accessToken: string;
  };
  config?: {
    width: number;
    height: number;
  };
}

const FileManagerReact: React.FC<Props> = ({ ...props }) => {
  const [isList, setIsList] = useState<boolean>(true);
  const [breadCrumb, setBreadCrumb] = useState<[]>([]);
  const [currentHash, setCurrentHash] = useState<string>('root');
  const [itemHash, setItemHash] = useState<string | undefined>(undefined);
  const [operationType, setOperationType] = useState<number | null>(null);

  const [config, setConfig] = useState<any>(props.config);
  const [header, setHeader] = useState<any>(props.header);

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
    config,
    header
  };

  return (
    <Context.Provider value={defaultValues}>
      <QueryClientProvider client={queryClient}>
        <App {...props} />
      </QueryClientProvider>
    </Context.Provider>
  );
};

function FileManager(props: any, elementId: any) {
  ReactDOM.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App {...props} />
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById(elementId)
  );
}

(window as any).FileManager = FileManager;

export { FileManager, FileManagerReact };
