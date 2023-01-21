import { instance } from './config';
import { Data } from '../config/types';

const namespace = 'api/core/drives';

export const getBaseDir: () => object = async () => {
  const { data } = await instance.get(`${namespace}`);
  return data;
};

export const getFolderContent: (hash: string) => object = async (hash) => {
  const { data } = await instance.get(`${namespace}/${hash}`);
  return data;
};

export const getFolderContentChildren = async (
  hash: string | object,
  params: string | object
): Promise<Data> => {
  const { data } = await instance.get(`${namespace}/${hash}/children`, {
    params: params
  });
  return data;
};

export const getUserStorage = async (): Promise<Data> => {
  const { data } = await instance.get(`${namespace}/storage`);
  return data;
};

export const createNewFolder = async (params): Promise<Data> => {
  const { data } = await instance.post(`${namespace}/folder`, params);
  return data;
};

export const deleteFileAndFolder = async (hash): Promise<Data> => {
  const { data } = await instance.delete(`${namespace}/${hash}`);
  return data;
};

export const renameFileAndFolder = async (
  params: Partial<{
    hash: string;
    newName: string;
  }>
) => {
  const hash = params.hash;
  delete params.hash;
  const { data } = await instance.post(`${namespace}/${hash}/rename`, params);
  return data;
};

/************************************* */
/********* U P L O A D *****************/
/************************************* */

export const upload = async (params, image = false, onUploadProgress) => {
  return await instance.post(
    `${namespace}/upload${image ? '/image' : ''}`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress,
    }
  );
};

/************************************* */
/********* C O P Y  &  C U T ***********/
/************************************* */

export const copy = async (
  params: Partial<{ hash: string; destFolderHash: string }>
): Promise<Data> => {
  const hash = params.hash;
  delete params.hash;
  const { data } = await instance.post(`${namespace}/${hash}/copy`, params);
  return data;
};

export const cut = async (params): Promise<Data> => {
  const hash = params.hash;
  delete params.hash;
  const { data } = await instance.post(`${namespace}/${hash}/cut`, params);
  return data;
};

/************************************* */
/********* A R C H I V E ***************/
/************************************* */

export const getArchiveList = async (params: string): Promise<Data> => {
  const { data } = await instance.get(`${namespace}/archive/${params}`);
  return data;
};

export const archiveRestore = async (params: string): Promise<Data> => {
  const { data } = await instance.post(
    `${namespace}/archive/restore/${params}`
  );
  return data;
};

export const archiveDelete = async (params: string): Promise<Data> => {
  const { data } = await instance.post(`${namespace}/archive/delete/${params}`);
  return data;
};

/************************************* */
/********* D O W N L O A D ***************/
/************************************* */

export const download = async (hash) => {
  return instance
    .get(`${namespace}/download/${hash}/`, {
      responseType: 'blob'
    })
    .then((response) => {
      const blob = response.data;
      return new Blob([blob]);
    });
};

export const downloadThumbnail = async (hash) => {
  return await instance.get(`${namespace}/download/${hash}/thumbnail`);
};
