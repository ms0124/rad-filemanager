import React, { FunctionComponent } from 'react';
import { FileManagerReact } from './index';
import { Row, Col } from 'reactstrap';
import { getBs } from './utils/index';

const App: FunctionComponent = () => {
  return (
    <>
      {/* <div
        style={{
          height: '200px',
          background: 'blue'
        }}
      ></div> */}
      <Row cssModule={getBs()}>
        <FileManagerReact
          clientId='17959574q2f0347718971594ccd86f3f4'
          accessToken='
5258131095-d05a337F1d6b47a29c7688a900d98757.XzIwMjY5'
          permissions={['full']}
          isSandbox={true}
          // permissions={[
          //   'upload',
          //   'upload_image',
          //   'search',
          //   'storage',
          //   'folder_create',
          //   'cut',
          //   'copy',
          //   'delete',
          //   'rename',
          //   'folder_children',
          //   'archive_list',
          //   'download',
          //   'archive_delete',
          //   'archive_restore'
          // ]}
          config={{ height: '400px' }}
        />
      </Row>
    </>
  );
};

export default App;
