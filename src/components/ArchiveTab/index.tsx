import React, { FunctionComponent, useContext } from 'react';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import Empty from '../StateColumnList/empty';

import { useArchiveList } from '../../config/hooks';
import { objectToQueryString } from '../../utils/';

const ArchiveTab: FunctionComponent = () => {
  const { isList, setCurrentHash } = useContext(Context);
  const { data } = useArchiveList(objectToQueryString({ offset: 0, size: 50 }));

  const listData: any = data?.result ? data?.result : [];
  return (
    <React.Fragment>
      {listData.length > 0 ? (
        isList ? (
          <Column list={listData} setHash={setCurrentHash} />
        ) : (
          <Row list={listData} setHash={setCurrentHash} />
        )
      ) : (
        <Empty />
      )}
    </React.Fragment>
  );
};

export default ArchiveTab;
