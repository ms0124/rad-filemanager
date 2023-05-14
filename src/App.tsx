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
          accessToken='f2771765c7aa4139b5ba9e42b8442a6b.XzIwMjM1'
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
          onSelect={(a) => console.log(a)}
        />
      </Row>
    </>
  );
};

export default App;
