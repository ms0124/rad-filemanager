import { useQuery, useMutation } from 'react-query';
import { queryClient } from './config';
import * as api from './api';
import { useContext } from 'react';
import { Context } from '../store';

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

export const useGetFolderContentChildren = (hash: string, query: string = "") => {
  return useQuery(
    ['folderContentChildren', { headers: getHeader(false), hash, query }],
    ({ queryKey }) => api.getFolderContentChildren(queryKey[1])
  );
};

export const useGetUserStorage = () => {
  return useQuery(['userStorage', getHeader()], ({ queryKey }) =>
    api.getUserStorage(queryKey[1])
  );
};

export const useCreateNewFolder = () => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: { name: string; parentHash: string }) =>
      api.createNewFolder({ headers, ...variables }),
    onSuccess: (data, variables, context) => {
      const { parentHash } = variables;
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: parentHash, headers }]
      });
    }
  });
};

export const useDeleteFileAndFolder = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: { hash: string | undefined }) =>
      api.deleteFileAndFolder({ headers, ...variables }),
    onSuccess: (_, variables) => {
      const { hash } = variables;
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};

export const useRenameFileAndFolder = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: { hash: string | undefined; newName: string }) =>
      api.renameFileAndFolder({ headers, ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};

export const useCopy = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: { hash: string; destFolderHash: string }) =>
      api.copy({ headers, ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};

export const useCut = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: { hash: string; destFolderHash: string }) =>
      api.cut({ headers, ...variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};

export const useArchiveList = (query: string) => {
  return useQuery(
    ['archiveList', { headers: getHeader(false), query }],
    ({ queryKey }) => api.getArchiveList(queryKey[1])
  );
};

export const useArchiveDelete = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: string) =>
      api.archiveDelete({ headers, variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};
export const useArchiveRestor = (folderHash) => {
  const headers = getHeader(false);
  return useMutation({
    mutationFn: (variables: string) =>
      api.archiveRestore({ headers, variables }),
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', { hash: folderHash, headers }]
      });
    }
  });
};
