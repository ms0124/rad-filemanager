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
          header={{
            clientId: '17959574q2f0347718971594ccd86f3f4',
            accessToken: '44fa70a1044541c9ba0d24537af7aa1a.XzIwMjM1'
          }}
          permissions={[
            'drives_upload',
            'drives_upload_image',
            'drives_search',
            'drives_storage',
            'drives_folder_create',
            'drives_cut',
            'drives_copy',
            'drives_delete',
            'drives_rename',
            'drives_folder_children',
            'drives_archive_list'
          ]}
          config={{ height: '400px' }}
        />
      </Row>
    </>
  );
};

export default App;
