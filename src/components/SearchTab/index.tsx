import React, { useContext, useEffect } from 'react';
import Empety from '../StateColumnList/empty';
import { TabTypes } from '../../config/types';
import { Loading, objectToQueryString } from '../../utils/index';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { useSearchList } from '../../config/hooks';

interface IProps {}

const SearchTab: React.FunctionComponent<IProps> = () => {
  const { isList, setCurrentHash, setBreadCrumb, searchText } =
    useContext(Context);

  const { data, isLoading } = useSearchList(
    objectToQueryString({ title: searchText, desc: true })
  );

  useEffect(() => {
    if (searchText.length) {
      setBreadCrumb([{ name: 'نتیجه جستجو', hash: '', disabled: true }]);
    }
  }, [searchText]);

  // let listData = [];
  // if (data && data?.result && Array.isArray(data.result)) {
  //   listData = data.result;
  // }

  const listData =
    data && data?.result && Array.isArray(data.result) ? data.result : [];

  return (
    <React.Fragment>
      {listData.length ? (
        isList ? (
          <Column
            list={listData}
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        ) : (
          <Row
            list={listData}
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        )
      ) : isLoading ? (
        <Loading wholePage />
      ) : (
        <Empety text='جستجو نتیجه ای نداشت !' />
      )}
    </React.Fragment>
  );
};

export default SearchTab;
