import utilStyles from '../../sass/style.module.scss';
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';
import { useInView } from 'react-intersection-observer';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import Empty from '../StateColumnList/empty';

import { useArchiveList, getHeader } from '../../config/hooks';
import { Loading, objectToQueryString } from '../../utils/';
import { TabTypes } from '../../config/types';
import Empety from '../StateColumnList/empty';

interface IProps {}

const ArchiveTab: FunctionComponent<IProps> = () => {
  const { isList, setCurrentHash, currentTab, setBreadCrumb } =
    useContext(Context);

  const { ref, inView } = useInView();
  let { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useArchiveList(getHeader(false));

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  useEffect(() => {
    if (currentTab == TabTypes.ArchiveList) {
      setBreadCrumb([{ name: 'آرشیو', hash: '', disabled: true }]);
    }
  }, [currentTab]);

  return (
    <React.Fragment>
      {data?.pages && data?.pages?.length > 0 ? (
        <React.Fragment>
          {isList ? (
            <Column
              pages={data?.pages}
              setHash={setCurrentHash}
              tabType={TabTypes.ArchiveList}
            />
          ) : (
            <Row
              pages={data?.pages}
              setHash={setCurrentHash}
              tabType={TabTypes.ArchiveList}
            />
          )}
          <div className={utilStyles['mb-4']} ref={ref}>
            {isFetching ? <Loading /> : '.'}
          </div>
        </React.Fragment>
      ) : isLoading ? (
        <Loading wholePage />
      ) : (
        <Empety />
      )}
    </React.Fragment>
  );
};

export default ArchiveTab;
