import { QueryClient } from 'react-query';
import axios from 'axios';

const BASE_URL = 'https://rad-sandbox.pod.ir/';
export const PAGE_SIZE = 50;

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export const instance = axios.create();
