import React, { useLayoutEffect, useRef, useContext } from 'react';
import { Context } from '../store/index';
import { instance } from '../config/config';
interface IProps {
  children: React.ReactElement;
}

const WithAxios: React.FC<IProps> = ({ children }) => {
  const { isSandbox } = useContext(Context);

  useLayoutEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(function (
      config
    ) {
      config.baseURL = isSandbox
        ? 'https://rad-sandbox.pod.ir'
        : 'https://rad-services.pod.ir';
      return config;
    });
    return () => instance.interceptors.request.eject(requestInterceptor);
  }, []);
  return children;
};

export default WithAxios;
