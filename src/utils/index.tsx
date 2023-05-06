import bs from 'bootstrap/dist/css/bootstrap.min.css';

import RightClick from './rightClick/index';
import { instance } from '../config/config';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
export { Loading } from './loading/index';

export const getBs = () => {
  return bs;
};

export const httpRequest = (
  url,
  { message = '', headers, ...params },
  method = 'GET'
) => {
  let instancRequest: Promise<AxiosResponse<any, any>>;
  switch (method.toUpperCase()) {
    case 'DELETE':
      instancRequest = instance.delete(url, { params, headers });
      break;
    case 'POST':
      instancRequest = instance.post(url, params, { headers });
      break;
    case 'PUT':
      instancRequest = instance.put(url, params, { headers });
      break;
    // case "PATCH":
    //   return instance.patch(url, data);
    //   break;
    default: // GET Request
      instancRequest = instance.get<any>(url, { params, headers });
  }
  return instancRequest
    .then((res) => {
      resultServ(res, message);
      return res.data;
    })
    .catch((err) => {
      resultServ(err, message);
      return err.data;
    });
};

const resultServ = (res, message) => {
  const { data } = res;
  if (data.hasError) {
    data.message.map((item) => toast.error(item));
  } else if (message) {
    toast.success(message);
  }
};

const brifStr = (str: string, length: number = 20): string => {
  return str.length >= length ? str.substr(0, length) + ' ...' : str;
};

const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const objectToQueryString = (obj: any): string => {
  return '?' + new URLSearchParams(obj).toString();
};

export { RightClick, formatBytes, brifStr, objectToQueryString };
