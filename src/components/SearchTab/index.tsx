import React, { useContext, useEffect } from 'react';
import Empety from '../StateColumnList/empty';
import { TabTypes } from '../../config/types';
import { Loading, objectToQueryString } from '../../utils/index';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { useSearchList } from '../../config/hooks';

interface IProps {
  searchText: string;
}

const SearchTab: React.FunctionComponent<IProps> = ({ searchText }) => {
  const { isList, setCurrentHash } = useContext(Context);

  const { data, isLoading } = useSearchList(
    objectToQueryString({ title: searchText, desc: true })
  );

  return (
    <React.Fragment>
      {data ? (
        isList ? (
          <Column
            list={
              data && data.result && Array.isArray(data.result)
                ? data.result
                : []
            }
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        ) : (
          <Row
            list={
              data && data.result && Array.isArray(data.result)
                ? data.result
                : []
            }
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        )
      ) : (
        isLoading ? (
        <Loading wholePage />
        ) :
        <Empety />
      )}
    </React.Fragment>
  );
};

export default SearchTab;
