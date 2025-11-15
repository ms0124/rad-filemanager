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
import { TabTypes, FolderTypes } from '../../config/types';
import { Loading } from '../../utils/index';
import { objectToQueryString } from '../../utils';
import { PAGE_SIZE } from '../../config/config';
import { useInView } from 'react-intersection-observer';

interface IProps {
  // offset: number;
  setTotal: (val: number) => void;
}

const FileTab: FunctionComponent<IProps> = ({ setTotal }) => {
  const {
    isList,
    setBreadCrumb,
    currentHash,
    setCurrentHash,
    currentTab,
    orderBy,
    desc,
    isShowCheckbox,
    setIsShowCheckbox,
    validExtension,
    setSelectedItems
  } = useContext(Context);

  let { data, isLoading, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetFolderContentChildren(
      currentHash,
      objectToQueryString({
        size: PAGE_SIZE,
        offset: 0, // just for first time
        order: orderBy,
        desc
      })
    );

  const { inView, ref } = useInView();
  if (data?.pages[0]?.result?.breadcrumb && currentTab === TabTypes.FileList) {
    setBreadCrumb(data?.pages[0]?.result?.breadcrumb);
  }

  useEffect(() => {
    if (currentTab == TabTypes.FileList) refetch();
  }, [orderBy, desc]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, currentHash]);

  const handleKeyDown = function (event) {
    if (event.key == 'Control' && !isShowCheckbox) {
      setIsShowCheckbox(true);
    }
    // Ctrl+A selects
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
  // const handleKeyUp = (event) => {
  //   console.log('up', { event });
  //   if (event.key=="Control" && isShowCheckbox) {
  //     setIsShowCheckbox(false);
  //   }
  // };

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    // document.body.addEventListener('keyup', handleKeyUp);
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
      // document.body.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShowCheckbox, data?.pages, validExtension]);

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

export default FileTab;
