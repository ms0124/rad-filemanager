import RightClick from './rightClick/index';

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
