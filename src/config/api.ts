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
  headers,
  hash,
  query
}: any): Promise<Data> => {
  return httpRequest(`${namespace}/${hash}/children/${query}`, {
    headers
  });
};

export const getUserStorage = ({ headers, ...params }: any): Promise<Data> => {
  return httpRequest(`${namespace}/storage`, { headers });
};

export const createNewFolder = ({ headers, ...params }: any): Promise<any> => {
  return httpRequest(
    `${namespace}/folder`,
    { headers, message: successMessage, ...params },
    'POST'
  );
};

export const deleteFileAndFolder = async ({ hash, headers }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}`,
    { headers, message: successMessage },
    'DELETE'
  );
};

export const renameFileAndFolder = async ({ headers, hash, newName }) => {
  return httpRequest(
    `${namespace}/${hash}/rename`,
    { newName, headers, message: successMessage },
    'POST'
  );
};

/************************************* */
/********* U P L O A D *****************/
/************************************* */

export const upload = async (
  params,
  image = false,
  configs,
  headers
) => {
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

export const copy = async ({ headers, hash, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}/copy`,
    {
      headers,
      message: successMessage,
      ...params
    },
    'POST'
  );
};

export const cut = async ({ headers, hash, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/${hash}/cut`,
    {
      headers,
      message: successMessage,
      ...params
    },
    'POST'
  );
};

/************************************* */
/********* A R C H I V E ***************/
/************************************* */

export const getArchiveList = async ({ headers, query, ...params }: any) => {
  return httpRequest(`${namespace}/archive/${query}`, {
    headers
  });
};

export const archiveRestore = async ({ headers, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/archive/restore/${params.variables}`,
    {
      headers
    },
    'POST'
  );
};

export const archiveDelete = async ({ headers, ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/archive/delete/${params.variables}`,
    {
      headers
    },
    'POST'
  );
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

/************************************* */
/*********** S E A R C H ***************/
/************************************* */

export const search = async ({ headers, query }: any) => {
  return await httpRequest(`${namespace}/search/${query}`, {
    headers
  });
};
