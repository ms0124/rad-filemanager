import { useQuery, useMutation, useInfiniteQuery } from 'react-query';
import { queryClient, PAGE_SIZE } from './config';
import * as api from './api';
import { useContext, useState, useEffect } from 'react';
import { Context } from '../store';
import { objectToQueryString } from '../utils/';

/************************************* */
/********* get Header ***************/
/************************************* */

export const getHeader = (inHeaders: boolean = true) => {
  const { header } = useContext(Context);
  if (inHeaders) {
    return {
      headers: {
        // common: {
        'Client-Id': `${header.clientId}`,
        'Access-Token': `${header.accessToken}`
        // }
      }
    };
  }
  return {
    // common: {
    'Client-Id': `${header.clientId}`,
    'Access-Token': `${header.accessToken}`
    // }
  };
};

export const useGetBaseDir = () => {
  return useQuery('baseDir', () => api.getBaseDir);
};

export const useGetFolderContent = (hash: string) => {
  return useQuery(['folderContent', hash], ({ queryKey }) =>
    api.getFolderContent(queryKey[1])
  );
};

export const useGetFolderContentChildren = (
  hash: string,
  query: string = ''
) => {
  return useInfiniteQuery(
    ['folderContentChildren', hash],
    ({ pageParam = { size: PAGE_SIZE, offset: 0 }, queryKey }) => {
      return api.getFolderContentChildren({
        hash: queryKey[1],
        query: objectToQueryString(pageParam)
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage?.count ? lastPage?.count : 0;
        let page = allPages.length === 0 ? 1 : allPages.length;
        const offset = PAGE_SIZE * page;
        if (offset >= total) {
          return undefined;
        }
        return {
          size: PAGE_SIZE,
          offset: offset
        };
      },
      cacheTime: 0
    }
  );
};

export const useGetUserStorage = () => {
  return useQuery(
    ['userStorage'],
    ({ queryKey }) => api.getUserStorage(queryKey[1]),
    { enabled: false } // disable this query from automatically running
  );
};

export const useCreateNewFolder = () => {
  return useMutation({
    mutationFn: (variables: { name: string; parentHash: string }) =>
      api.createNewFolder({ ...variables }),
    onSuccess: (data, variables, context) => {
      const { parentHash } = variables;
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', parentHash]
      });
    }
  });
};

export const useDeleteFileAndFolder = (folderHash) => {
  return useMutation({
    mutationFn: (variables: { hash: string | undefined }) =>
      api.deleteFileAndFolder({ ...variables }),
    onSuccess: (_, variables) => {
      const { hash } = variables;
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useRenameFileAndFolder = (folderHash) => {
  return useMutation({
    mutationFn: (variables: { hash: string | undefined; newName: string }) =>
      api.renameFileAndFolder({ ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useCopy = (folderHash) => {
  return useMutation({
    mutationFn: (variables: { hash: string; destFolderHash: string }) =>
      api.copy({ ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useCut = (folderHash) => {
  return useMutation({
    mutationFn: (variables: { hash: string; destFolderHash: string }) =>
      api.cut({ ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useArchiveList = () => {
  return useInfiniteQuery(
    ['archiveList'],
    ({ pageParam = { size: PAGE_SIZE, offset: 0 } }) => {
      return api.getArchiveList({
        query: objectToQueryString(pageParam)
      });
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const total = lastPage?.count ? lastPage?.count : 0;
        let page = allPages.length === 0 ? 1 : allPages.length;
        const offset = PAGE_SIZE * page;
        if (offset >= total) {
          return undefined;
        }
        return {
          size: PAGE_SIZE,
          offset: offset
        };
      }
    }
  );
};

export const useArchiveDelete = (folderHash) => {
  return useMutation({
    mutationFn: (variables: string) =>
      api.archiveDelete({ variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['archiveList']
      });
    }
  });
};
export const useArchiveRestor = (folderHash) => {
  return useMutation({
    mutationFn: (variables: string) =>
      api.archiveRestore({ variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['archiveList']
      });
    }
  });
};

export const useSearchList = (query: string) => {
  return useQuery(
    ['searchList', { query }],
    ({ queryKey }) => api.search(queryKey[1])
  );
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
