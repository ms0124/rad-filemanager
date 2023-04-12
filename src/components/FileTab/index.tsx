import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import { useGetFolderContentChildren } from '../../config/hooks';

import Empety from '../StateColumnList/empty';
import { TabTypes } from '../../config/types';
import { Loading } from '../../utils/index';
import { objectToQueryString } from '../../utils';
import { PAGE_SIZE } from '../../config/config';

interface IProps {
  offset: number;
  setTotal: (val: number) => void;
}

const FileTab: FunctionComponent<IProps> = ({ offset, setTotal }) => {
  const { isList, setBreadCrumb, currentHash, setCurrentHash, currentTab } =
    useContext(Context);
  const [listData, setListData] = useState<any>([]);
  let { data, isLoading } = useGetFolderContentChildren(
    currentHash,
    objectToQueryString({ size: PAGE_SIZE, offset })
  );

  if (data?.result?.breadcrumb && currentTab !== TabTypes.SearchList) {
    setBreadCrumb(data?.result?.breadcrumb);
  }

  useEffect(() => {
    if (data && data.count) setTotal(data.count);
    // if (data) {
    // const _result = data?.result.list ? data?.result.list : [];
    // setListData((prev) => [...prev, ..._result]);
    // }
  }, [data]);

  // const listData: any = data?.result.list ? data?.result.list : [];
  return (
    <React.Fragment>
      {data?.result && data.result.list?.length > 0 ? (
        isList ? (
          <Column
            list={data.result.list ? data.result.list : []}
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        ) : (
          <Row
            list={data?.result.list ? data?.result.list : []}
            setHash={setCurrentHash}
            tabType={TabTypes.FileList}
          />
        )
      ) : isLoading ? (
        <Loading wholePage />
      ) : (
        <Empety />
      )}
    </React.Fragment>
  );
};

export default FileTab;
