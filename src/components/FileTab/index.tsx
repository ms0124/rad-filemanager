import utilStyles from '../../sass/style.module.scss';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { getHeader, useGetFolderContentChildren } from '../../config/hooks';

import Empety from '../StateColumnList/empty';
import { TabTypes } from '../../config/types';
import { Loading } from '../../utils/index';
import { objectToQueryString } from '../../utils';
import { PAGE_SIZE } from '../../config/config';
import { useInView } from 'react-intersection-observer';

interface IProps {
  // offset: number;
  setTotal: (val: number) => void;
}

const FileTab: FunctionComponent<IProps> = ({ setTotal }) => {
  const { isList, setBreadCrumb, currentHash, setCurrentHash, currentTab } =
    useContext(Context);

  let { data, isLoading,isFetching,  fetchNextPage, hasNextPage } =
    useGetFolderContentChildren(
      currentHash,
      objectToQueryString({ size: PAGE_SIZE, offset: 0 }),
      getHeader(false)
    );

  const { inView, ref } = useInView();
  if (data?.pages[0]?.result?.breadcrumb && currentTab !== TabTypes.SearchList) {
    setBreadCrumb(data?.pages[0]?.result?.breadcrumb);
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, currentHash]);
  
  return (
    <React.Fragment>
      {data?.pages[0]?.result && data?.pages[0]?.result?.list?.length > 0 ? (
        <React.Fragment>
          {isList ? (
            <Column
              // list={data.result.list ? data.result.list : []}
              pages={data?.pages}
              setHash={setCurrentHash}
              tabType={TabTypes.FileList}
            />
          ) : (
            <Row
              // list={data?.result.list ? data?.result.list : []}
              pages={data?.pages}
              setHash={setCurrentHash}
              tabType={TabTypes.FileList}
            />
          )}
          <div className={utilStyles['mb-4']} ref={ref}>{isFetching ? <Loading /> : '.'}</div>
        </React.Fragment>
      ) : isLoading ? (
        <Loading wholePage />
      ) : (
        <Empety />
      )}
    </React.Fragment>
  );
};

export default FileTab;
