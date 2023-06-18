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
          accessToken='70551d5efbd640c4917d8a77cb039020.XzIwMjM2'
          // permissions={['full']}
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
          onSelect={(a) => console.log(a)}
        />
      </Row>
    </>
  );
};

export default App;
