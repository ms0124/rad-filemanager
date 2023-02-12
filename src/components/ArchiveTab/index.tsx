import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from 'react';

import Row from '../StateColumnList/row';
import { Context } from '../../store/index';
import Column from '../StateColumnList/column';
import Empty from '../StateColumnList/empty';

import { useArchiveList } from '../../config/hooks';
import { Loading, objectToQueryString } from '../../utils/';
import { TabTypes } from '../../config/types';

interface IProps {
  setTotal: (val: number) => void;
  offset: number;
}

const ArchiveTab: FunctionComponent<IProps> = ({ setTotal, offset }) => {
  const { isList, setCurrentHash } = useContext(Context);
  const [listData, setListData] = useState<any>([]);

  const { data, isLoading } = useArchiveList(
    objectToQueryString({ offset: offset, size: 50 })
  );

  useEffect(() => {
    if (data && data.count) setTotal(data.count);
    if (data) {
      const _result = data?.result ? data?.result : [];
      setListData((prev) => [...prev, ..._result]);
    }
  }, [data]);

  // const listData: any = data?.result ? data?.result : [];
  return (
    <React.Fragment>
      {listData.length > 0 ? (
        isList ? (
          <Column
            list={listData}
            setHash={setCurrentHash}
            tabType={TabTypes.ArchiveList}
          />
        ) : (
          <Row
            list={listData}
            setHash={setCurrentHash}
            tabType={TabTypes.ArchiveList}
          />
        )
      ) : isLoading ? (
        <Loading wholePage />
      ) : (
        <Empty />
      )}
    </React.Fragment>
  );
};

export default ArchiveTab;
