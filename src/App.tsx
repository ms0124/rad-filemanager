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
          accessToken='b4c20bba660a4df4ad44ce4b03f39f32.XzIwMjM3'
          // permissions={['full']}
          isSandbox={false}
          permissions={[
            'upload',
            'upload_image',
            'search',
            'storage',
            'folder_create',
            'cut',
            'copy',
            'delete',
            'rename',
            'folder_children',
            'archive_list',
            'download',
            'archive_delete',
            'archive_restore'
          ]}
          config={{ height: '400px' }}

        />
      </Row>
    </>
  );
};

export default App;
