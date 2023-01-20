import { QueryClient } from 'react-query';
import axios from 'axios';

const CLIENT_ID = '17959574q2f0347718971594ccd86f3f4';
const BASE_URL = 'https://rad-sandbox.pod.ir/';

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    common: {
      'Client-Id': CLIENT_ID,
      'Access-Token': '1e31907a78d94b79853c83cfa20daab5.XzIwMjMx'
    }
  }
});
