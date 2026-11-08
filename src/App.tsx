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
          clientId='22d3be94bf4311b91a4480fe933e12'
          accessToken='
9263689434-1e78300e304b412a99f930e98F51d6e3.XzIwMjYxMQ'
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
