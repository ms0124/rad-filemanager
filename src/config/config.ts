import { QueryClient } from 'react-query';
import axios from 'axios';

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
  'zip',
  'apk',
];
export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});


export const directSandbox = "https://podspace.sandpod.ir";
export const directMain = "https://podspace.pod.ir";

export const instance = axios.create();
