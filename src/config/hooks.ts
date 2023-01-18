import { useQuery, useMutation } from 'react-query';
import { queryClient } from './config';
import * as api from './api';

export const useGetBaseDir = () => {
  return useQuery('baseDir', api.getBaseDir);
};

export const useGetFolderContent = (hash: string) => {
  return useQuery(['folderContent', hash], ({ queryKey }) =>
    api.getFolderContent(queryKey[1])
  );
};

export const useGetFolderContentChildren = (
  hash: string,
  params: object = {}
) => {
  return useQuery(['folderContentChildren', hash, params], ({ queryKey }) =>
    api.getFolderContentChildren(queryKey[1], queryKey[2])
  );
};

export const useGetUserStorage = () => {
  return useQuery('userStorage', api.getUserStorage);
};

export const useCreateNewFolder = () => {
  return useMutation(api.createNewFolder, {
    onSuccess: (_, { parentHash }) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', parentHash]
      });
    }
  });
  // return useQuery(['createNewFolder', params], ({ queryKey }) =>
  //   api.createNewFolder(queryKey[1])
  // );
};

export const useDeleteFileAndFolder = (folderHash) => {
  return useMutation(api.deleteFileAndFolder, {
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useRenameFileAndFolder = (folderHash) => {
  return useMutation(api.renameFileAndFolder, {
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useCopy = (folderHash) => {
  return useMutation(api.copy, {
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useCut = (folderHash) => {
  return useMutation(api.cut, {
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: ['folderContentChildren', folderHash]
      });
    }
  });
};

export const useArchiveList = (params: string) => {
  return useQuery(['archiveList', params], ({ queryKey }) =>
    api.getArchiveList(queryKey[1])
  );
};

