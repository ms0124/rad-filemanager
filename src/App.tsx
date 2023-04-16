import React, { FunctionComponent } from 'react';
import { FileManagerReact } from './index';

const App: FunctionComponent = () => {
  return (
    <FileManagerReact
      header={{
        clientId: '17959574q2f0347718971594ccd86f3f4',
        accessToken: '0a6865394c2445e18af3734980b3322d.XzIwMjM0'
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
  );
};

export default App;
