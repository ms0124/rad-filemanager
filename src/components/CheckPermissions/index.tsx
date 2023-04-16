import React, { useContext } from 'react';
import { Context } from '../../store/index';
import Empty from '../../components/StateColumnList/empty';
interface IProps {
  permissions: string[];
  operator?: string;
  showMessage?: boolean;
}

const CheckPermissions: React.FunctionComponent<IProps> = ({
  permissions,
  operator = 'OR',
  showMessage = false,
  children
}) => {
  const { permissions: globalPermissions } = useContext(Context);

  if (permissions.length === 1 && permissions[0] === 'full') {
    return <>{children}</>;
  }
  let permissionsLength = permissions.length;
  for (const per of globalPermissions) {
    if (permissions.find((item) => item === per)) {
      if (operator === 'OR') {
        return <>{children}</>;
      }
      permissionsLength--;
    }
    // for state AND
    if (permissionsLength === 0) {
      return <>{children}</>;
    }
  }
  return showMessage ? (
    <Empty text='شما درسترسی به این بخش را ندارید.' />
  ) : null;
};

export default CheckPermissions;
