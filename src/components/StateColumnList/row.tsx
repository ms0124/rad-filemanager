import React, { FunctionComponent } from 'react';
import { Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faGlobe } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-jalaali';

import { formatBytes, brifStr } from '../../utils/index';
interface IProps {
  list: any;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const Row: FunctionComponent<IProps> = ({ list = [], setHash }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th className='text-center'>نام فایل</th>
          <th className='text-center'>تاریخ ایجاد</th>
          <th className='text-center'>تاریخ ویرایش</th>
          <th className='text-center'>حجم فایل</th>
          <th className='text-center'>وضعیت اشتراک گذاری</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item, index) => (
          <tr key={index}>
            <th scope='row' style={{cursor: "pointer"}} onClick={() => setHash(item.hash)}>
              {brifStr(item.name)}
            </th>
            <td className='dirLtr text-center'>
              {moment(item.created).format('jYYYY/jMM/jDD HH:mm:ss')}
            </td>
            <td className='dirLtr text-center'>
              {' '}
              {moment(item.updated).format('jYYYY/jMM/jDD HH:mm:ss')}
            </td>
            <td className='dirLtr text-center'>{formatBytes(item.size)}</td>
            <td className='text-center'>
              {item.isPublic ? (
                <FontAwesomeIcon icon={faGlobe} />
              ) : (
                <FontAwesomeIcon icon={faKey} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Row;
