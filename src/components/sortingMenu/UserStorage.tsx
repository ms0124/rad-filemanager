import React from 'react';
import { useGetUserStorage } from '../../config/hooks';
import { formatBytes } from '../../utils/index';

const UserStorage: React.FunctionComponent = () => {
  const { data, isLoading } = useGetUserStorage();
  let storageLimit: string = '0';
  let storageUsage: string = '0';
  let percent: string = '0';

  if (!isLoading && data?.result) {
    percent = (
      ((data?.result[0]?.result?.storageUsage) /
        data?.result[0]?.result?.storageLimit) *
      100
    ).toFixed(2);
    storageLimit = formatBytes(data?.result[0]?.result?.storageLimit);
    storageUsage = formatBytes(data?.result[0]?.result?.storageUsage);
  }

  return (
    <React.Fragment>
      <div
        className='d-flex justify-content-between'
        style={{ fontSize: '12px' }}
      >
        <span>فضای پرشده</span>
        <div>
          <span>{storageUsage}</span>
          <span> از </span>
          <span>{storageLimit}</span>
        </div>
      </div>
      <div className='user-storage'>
        <div className='user-storage__wrapper'>
          <div className='user-storage__wrapper--bar'>
            <span
              className='user-storage__wrapper--fill'
              style={{ width: `${percent}%` }}
            ></span>
          </div>
        </div>
        <span className='user-storage__percent'>{percent}%</span>
      </div>
    </React.Fragment>
  );
};

export default UserStorage;
