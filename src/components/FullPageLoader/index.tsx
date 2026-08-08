// FullPageLoader.tsx
import React from 'react';
import { Spinner } from 'reactstrap';
import styles from './style.module.scss';


const FullPageLoader: React.FC = () => {
  return (
    <div
   className={styles['full-page-loader']}
    >
      <Spinner style={{ width: '3rem', height: '3rem' }} color="primary" />
    </div>
  );
};

export default FullPageLoader;