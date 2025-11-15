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

import { useArchiveList } from '../../config/hooks';
import { Loading, objectToQueryString } from '../../utils/';
import { TabTypes, FolderTypes } from '../../config/types';
import Empety from '../StateColumnList/empty';
import { PAGE_SIZE } from '../../config/config';

interface IProps {}

const ArchiveTab: FunctionComponent<IProps> = () => {
  const {
    isList,
    setCurrentHash,
    currentTab,
    setBreadCrumb,
    orderBy,
    desc,
    setIsShowCheckbox,
    validExtension,
    setSelectedItems
  } = useContext(Context);

  const { ref, inView } = useInView();
  let { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useArchiveList(
      objectToQueryString({ size: PAGE_SIZE, offset: 0, order: orderBy, desc })
    );

  useEffect(() => {
    if (currentTab == TabTypes.ArchiveList) refetch();
  }, [orderBy, desc]);

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
  // Ctrl+A selects
  useEffect(() => {
    const handleKeyDown = function (event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'a' || event.key === 'A')
      ) {
        event.preventDefault();
        setIsShowCheckbox(true);
        try {
          const pagesData = data?.pages || [];
          const list: any[] = [];
          pagesData.forEach((page) => {
            const arr = page?.result?.list ? page?.result?.list : page?.result;
            if (Array.isArray(arr)) list.push(...arr);
          });
          const valid = list.filter((item) =>
            validExtension.find(
              (x) =>
                x?.toLowerCase() === item?.extension?.toLowerCase() ||
                (!item.extension &&
                  x === 'dir' &&
                  item.type === FolderTypes.folder)
            )
          );
          setSelectedItems((prev) => {
            const merged: any[] = [];
            const seen = new Set<string>();
            [...prev, ...valid].forEach((item) => {
              if (!seen.has(item.hash)) {
                seen.add(item.hash);
                merged.push(item);
              }
            });
            return merged;
          });
        } catch (e) {}
      }
    };
    document.body.addEventListener('keydown', handleKeyDown);
    return () => document.body.removeEventListener('keydown', handleKeyDown);
  }, [data?.pages]);

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
