import bs from 'bootstrap/dist/css/bootstrap.min.css';

import RightClick from './rightClick/index';
import { instance } from '../config/config';
import { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
export { Loading } from './loading/index';

export const getBs = () => {
  return bs || {};
};

interface IParams {
  newName?: string;
  headers?: null;
  message?: string;
}
export const httpRequest = (
  url,
  { message = '', headers = null, ...params }: IParams = {},
  method = 'GET'
) => {
  let instancRequest: Promise<AxiosResponse<any, any>>;
  switch (method.toUpperCase()) {
    case 'DELETE':
      instancRequest = instance.delete(url, { params });
      break;
    case 'POST':
      instancRequest = instance.post(url, params);
      break;
    case 'PUT':
      instancRequest = instance.put(url, params);
      break;
    // case "PATCH":
    //   return instance.patch(url, data);
    //   break;
    default: // GET Request
      instancRequest = instance.get<any>(url, { params });
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

const brifStr = (str: string = '', length: number = 20): string => {
  return str.length >= length ? str.substr(0, length) + ' ...' : str;
};

const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}  ${sizes[i]}`;
};

const objectToQueryString = (obj: any): string => {
  return '?' + new URLSearchParams(obj).toString();
};
type a = string | number | boolean;

const serializeUrl = (urlParameters) => {
  const output = Object.entries(urlParameters).map(
    ([key, value]: [string, string | string[]], index) => {
      if (Array.isArray(value)) {
        let arrToUrl = index === 0 ? '?' : '';
        value.forEach((item, i) => {
          arrToUrl += `${key}[]=${encodeURIComponent(item)}`;
          if (value.length > i + 1) arrToUrl += '&';
        });
        return arrToUrl;
      }
      return `${index === 0 ? '?' : ''}${key}=${encodeURIComponent(value)}`;
    }
  );
  return output.join('&');
};

const getThumbnailUrl = (hash, isSandbox) =>
  isSandbox
    ? `https://podspace.sandpod.ir/api/files/${hash}/thumbnail`
    : `https://podspace.pod.ir/api/files/${hash}/thumbnail`;

const isPermitted = (userPermissions, permissions, operator = 'AND') => {
  let isPermitted = false;

  let permissionsLength = permissions.length;
  if (userPermissions.length === 1 && userPermissions[0] === 'full') {
    return true;
  }
  for (const permission of userPermissions) {
    if (permissions.find((item) => item === permission)) {
      if (operator === 'OR') {
        return true;
      }
      permissionsLength--;
    }
    if (permissionsLength === 0) {
      isPermitted = true;
      break;
    }
  }

  return isPermitted;
};


const getViewport  = () => {
  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  if (width <= 576) return 'xs'
  if (width <= 768) return 'sm'
  if (width <= 992) return 'md'
  if (width <= 1200) return 'lg'
  if (width <= 1400) return 'xl'
  return 'xxl'
}

const getParamsFromUrl = (url) => {
  url = decodeURI(url);
  if (typeof url === 'string') {
      let params = url.split('?');
      let eachParamsArr = params[1].split('&');
      let obj = {};
      if (eachParamsArr && eachParamsArr.length) {
          eachParamsArr.map(param => {
              let keyValuePair = param.split('=')
              let key = keyValuePair[0];
              let value = keyValuePair[1];
              obj[key] = value;
          })
      }
      return obj;
  }
  return {}
}
export {
  isPermitted,
  RightClick,
  formatBytes,
  brifStr,
  objectToQueryString,
  serializeUrl,
  getThumbnailUrl,
  getViewport,
  getParamsFromUrl
};
