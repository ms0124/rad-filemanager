import { QueryClient } from 'react-query';
import axios from 'axios';

const BASE_URL = 'https://rad-sandbox.pod.ir/';
export const PAGE_SIZE = 50;
export const validExtensionList = [
  'dir',
  'doc',
  'docx',
  'pdf',
  'xls',
  'xlsx',
  'jpg',
  'png',
  'gif',
  'jpeg',
  'mpg',
  'mp4',
  'ogg',
  'mp3',
  'mpeg',
  'wma',
  'svg',
  'html',
  'json',
  'webp',
  'txt',
  'gz',
  'rar',
  'zip'
];
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export const instance = axios.create();
