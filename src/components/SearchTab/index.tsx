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

  // initialValue '' is required: with the current text as the initial value the
  // very first keystroke would fire a request immediately instead of waiting
  // for 500ms of silence.
  const debonceSearch = useDebounce(searchText, 500, '');
  const trimmedSearch = debonceSearch.trim();
  const isDebouncing = searchText.trim() !== trimmedSearch;

  const { data, isLoading } = useSearchList(
    objectToQueryString({ title: trimmedSearch, desc: true }),
    // no request for an empty term (e.g. while the debounce is still pending)
    { enabled: !!trimmedSearch }
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
      {pagesArray[0].result.list.length && !isLoading && !isDebouncing ? (
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
      ) : isLoading || isDebouncing ? (
        <Loading wholePage />
      ) : (
        <Empety text='جستجو نتیجه ای نداشت !' />
      )}
    </React.Fragment>
  );
};

export default SearchTab;
