import React, { FunctionComponent, useContext, useState } from 'react';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { useGetFolderContentChildren } from '../../config/hooks';

import Empety from '../StateColumnList/empty';

const FileTab: FunctionComponent = () => {
  const { isList, setBreadCrumb, currentHash, setCurrentHash } =
    useContext(Context);

  let { data } = useGetFolderContentChildren(currentHash);
  if (data?.result?.breadcrumb) {
    setBreadCrumb(data?.result?.breadcrumb);
  }

  const listData: any = data?.result.list ? data?.result.list : [];
  return (
    <React.Fragment>
      {listData.length > 0 ? (
        isList ? (
          <Column list={listData} setHash={setCurrentHash} />
        ) : (
          <Row list={listData} setHash={setCurrentHash} />
        )
      ) : (
        <Empety />
      )}
    </React.Fragment>
  );
};

export default FileTab;
