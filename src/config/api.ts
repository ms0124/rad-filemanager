import { instance , directMain, directSandbox} from './config';
import { Data } from '../config/types';
import { httpRequest } from '../utils/index';

const namespace = 'api/core/drives';
const successMessage = 'عملیات با موفقیت انجام شد';

export const getBaseDir: () => object = async () => {
  const { data } = await instance.get(`${namespace}`);
  return data;
};

export const getFileDetails: (hash: string) => Promise<Data> = async (hash) => {
  const { data } = await instance.get(`${namespace}/${hash}`);
  return data;
};

export const getFolderContentChildren = ({
  hash,
  query
}: any): Promise<Data> => {
  return httpRequest(`${namespace}/${hash}/children/${query}`);
};

export const getUserStorage = (): Promise<Data> => {
  return httpRequest(`${namespace}/storage`);
};

export const createNewFolder = ({ ...params }: any): Promise<any> => {
  return httpRequest(
    `${namespace}/folder`,
    { message: successMessage, ...params },
    'POST'
  );
};

export const deleteFileAndFolder = async ({ hashes }): Promise<Data> => {
  const params = { hashes }
  return httpRequest(
    `${namespace}/batch/delete`,
    { message: successMessage , ...params},
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
// برای یک سری تغیرات مجبور شدن ای پی ای آپلود رو عوض کنم در صورتی که این تغیرات تکمیل شوند این api شبیه الباقی میشود.
export const upload = async ({ isSandbox, formData, uploadHash, stream}, image = false, configs, headers) => {

  let url = `${namespace}/upload${image ? '/image' : ''}`;
  if(!stream ) {
    if(isSandbox){
      url =  `${directSandbox}/api/files/${uploadHash}`;
    }else {
      url = `${directMain}/api/files/${uploadHash}`;
    }
  }

  return await instance.post(
    url,
    formData,
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

export const uploadLink = async (params) => {
  return await httpRequest(`${namespace}/upload/link${params}`);
}

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
/************************************************************/
/********* C O P Y  &  C U T  ---->>>> multi items***********/
/************************************************************/

export const copyMulti = async ({ ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/batch/copy`,
    {
      message: successMessage,
      ...params
    },
    'POST'
  );
};

export const cutMulti = async ({ ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/batch/cut`,
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
    { message: successMessage },
    'POST'
  );
};

export const archiveDelete = async ({ ...params }): Promise<Data> => {
  return httpRequest(
    `${namespace}/archive/delete/${params.variables}`,
    { message: successMessage },
    'DELETE'
  );
};

/************************************* */
/********* D O W N L O A D ***************/
/************************************* */

export const download = async ({isSandbox,  downloadLink}) => {
  let url = '';
  if(isSandbox){
      url =  `${directSandbox}/api/links/${downloadLink}`;
    }else {
    url = `${directMain}/api/links/${downloadLink}`;
  }
  const response: any = await instance.get(`${url}`, { responseType: 'blob' });
  const blob = response.data;
  return new Blob([blob]);

};

export const downloadThumbnail = async (hash) => {
  return await instance.get(`${namespace}/download/${hash}/thumbnail`);
};

export const downloadLink = async (params) => {
  return await httpRequest(`${namespace}/download/link${params}`);
}

/************************************* */
/*********** S E A R C H ***************/
/************************************* */

export const search = async ({ query }: any) => {
  return await httpRequest(`${namespace}/search/${query}`);
};

/************************************* */
/*********** S H A R E ***************/
/************************************* */

export const detailShare = async ({ hash }: any) => {
  return await httpRequest(`${namespace}/${hash}/shares`);
};

export const addShare = async ({ hash, identity, params }: any) => {
  return await httpRequest(
    `${namespace}/${hash}/share/user/${identity}`,
    { message: successMessage, ...params },
    'POST'
  );
};

export const deleteShare = async ({ hash, identity, params }: any) => {
  return await httpRequest(
    `${namespace}/${hash}/share/user/${identity}`,
    { message: successMessage, ...params },
    // {},
    'DELETE'
  );
};

/************************************* */
/*********** CHANGE ACCESS***************/
/************************************* */

export const addPublic = async ({ hash, params }: any) => {
  return await httpRequest(`${namespace}/${hash}/share/public`, params, 'POST');
};

export const removePublic = async ({ hash }: any) => {
  return await httpRequest(`${namespace}/${hash}/share/public`, {}, 'DELETE');
};
