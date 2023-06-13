import React, { useContext, useEffect } from 'react';
import Empety from '../StateColumnList/empty';
import { TabTypes } from '../../config/types';
import { Loading, objectToQueryString } from '../../utils/index';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { useSearchList, useDebounce } from '../../config/hooks';

interface IProps {}

const SearchTab: React.FunctionComponent<IProps> = () => {
  const { isList, setCurrentHash, setBreadCrumb, searchText } =
    useContext(Context);
  const debonceSearch = useDebounce(searchText, 500);
  const { data, isLoading } = useSearchList(
    objectToQueryString({ title: debonceSearch, desc: true })
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

  let pagesArray: any = [ { result: { list: [] } } ];
  pagesArray[0].result.list =
    data && data?.result && Array.isArray(data.result) ? data.result : [];

  return (
    <React.Fragment>
      {pagesArray[0].result.list.length && !isLoading ? (
        isList ? (
          <Column
            pages={pagesArray}
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        ) : (
          <Row
            pages={pagesArray}
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
