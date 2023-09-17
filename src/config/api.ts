import { instance } from './config';
import { Data } from '../config/types';
import { httpRequest } from '../utils/index';

const namespace = 'api/core/drives';
const successMessage = 'عملیات با موفقیت انجام شد';
export const getBaseDir: () => object = async () => {
  const { data } = await instance.get(`${namespace}`);
  return data;
};

export const getFolderContent: (hash: string) => object = async (hash) => {
  const { data } = await instance.get(`${namespace}/${hash}`);
  return data;
};

export const getFolderContentChildren = ({
  hash,
  query
}: any): Promise<Data> => {
  return httpRequest(`${namespace}/${hash}/children/${query}`);
};

export const getUserStorage = ({ ...params }: any): Promise<Data> => {
  return httpRequest(`${namespace}/storage`);
};

export const createNewFolder = ({ ...params }: any): Promise<any> => {
  return httpRequest(
    `${namespace}/folder`,
    { message: successMessage, ...params },
    'POST'
  );
};

export const deleteFileAndFolder = async ({ hash }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}`,
    { message: successMessage },
    'DELETE'
  );
};

export const renameFileAndFolder = async ({ hash, newName }) => {
  return httpRequest(
    `${namespace}/${hash}/rename`,
    { newName, message: successMessage },
    'POST'
  );
};

/************************************* */
/********* U P L O A D *****************/
/************************************* */

export const upload = async (params, image = false, configs, headers) => {
  return await instance.post(
    `${namespace}/upload${image ? '/image' : ''}`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers
      },
      onUploadProgress: configs.onUploadProgress,
      signal: configs.signal
    }
  );
};

/************************************* */
/********* C O P Y  &  C U T ***********/
/************************************* */

export const copy = async ({ hash, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}/copy`,
    {
      message: successMessage,
      ...params
    },
    'POST'
  );
};

export const cut = async ({ hash, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}/cut`,
    {
      message: successMessage,
      ...params
    },
    'POST'
  );
};

/************************************* */
/********* A R C H I V E ***************/
/************************************* */

export const getArchiveList = async ({ query, ...params }: any) => {
  return httpRequest(`${namespace}/archive/${query}`);
};

export const archiveRestore = async ({ ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/archive/restore/${params.variables}`,
    {},
    'POST'
  );
};

export const archiveDelete = async ({ ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/archive/delete/${params.variables}`,
    {},
    'DELETE'
  );
};

/************************************* */
/********* D O W N L O A D ***************/
/************************************* */

export const download = async (hash, headers) => {
  return instance
    .get(`${namespace}/download/${hash}/`, {
      responseType: 'blob',
      headers
    })
    .then((response) => {
      const blob = response.data;
      return new Blob([blob]);
    });
};

export const downloadThumbnail = async (hash) => {
  return await instance.get(`${namespace}/download/${hash}/thumbnail`);
};

/************************************* */
/*********** S E A R C H ***************/
/************************************* */

export const search = async ({ query }: any) => {
  return await httpRequest(`${namespace}/search/${query}`);
};
