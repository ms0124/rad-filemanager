import styles from './style.module.scss';
import utilsStyles from '../../sass/style.module.scss';
import React from 'react';
import { useGetUserStorage } from '../../config/hooks';
import { formatBytes } from '../../utils/index';
import CheckPermissions from '../CheckPermissions';

const UserStorage: React.FunctionComponent = () => {
  const { data, isLoading } = useGetUserStorage();
  let storageLimit: any = '0';
  let storageUsage: any = '0';
  let percent: string = '0';

  if (!isLoading && data?.result) {
    percent = (
      (data?.result[0]?.result?.storageUsage /
        data?.result[0]?.result?.storageLimit) *
      100
    ).toFixed(2);
    storageLimit = formatBytes(data?.result[0]?.result?.storageLimit);
    storageUsage = formatBytes(data?.result[0]?.result?.storageUsage);

    storageLimit = storageLimit ? storageLimit.split('  ') : '0';
    storageUsage = storageUsage ? storageUsage.split('  ') : '0';
  }

  return (
    <React.Fragment>
      <CheckPermissions permissions={['storage']}>
        <div
          className={`${utilsStyles['d-flex']} ${utilsStyles['justify-content-between']}`}
          style={{ fontSize: '12px' }}
        >
          <span>فضای پرشده</span>
          <div>
            <span>{storageUsage ? storageUsage[0] : ''}{" "}</span>
            <span>{storageUsage ? storageUsage[1] : ''}</span>
            <span> از </span>
            <span>{storageLimit ? storageLimit[0] : ''}{" "}</span>
            <span>{storageLimit ? storageLimit[1] : ''}</span>
          </div>
        </div>
        <div className={styles['user-storage']}>
          <div className={styles['user-storage__wrapper']}>
            <div className={styles['user-storage__wrapper--bar']}>
              <span
                className={styles['user-storage__wrapper--fill']}
                style={{ width: `${percent}%` }}
              ></span>
            </div>
          </div>
          <span className={styles['user-storage__percent']}>{percent}%</span>
        </div>
      </CheckPermissions>
    </React.Fragment>
  );
};

export default UserStorage;
