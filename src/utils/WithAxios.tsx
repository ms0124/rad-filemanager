import React, { useLayoutEffect, useRef, useContext } from 'react';
import { Context } from '../store/index';
import { instance } from '../config/config';
interface IProps {
  children: React.ReactElement;
}

const WithAxios: React.FC<IProps> = ({ children }) => {
  const { isSandbox, header } = useContext(Context);

  useLayoutEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(function (
      config
    ) {
      config.baseURL = isSandbox
        ? 'https://rad-sandbox.pod.ir'
        : 'https://rad-services.pod.ir';

      config.headers['Client-Id'] = `${header.clientId}`;
      config.headers['Access-Token'] = `${header.accessToken}`;

      return config;
    });
    return () => instance.interceptors.request.eject(requestInterceptor);
  }, [header?.accessToken]);
  return children;
};

export default WithAxios;
