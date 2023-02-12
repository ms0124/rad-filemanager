import React from 'react';

import { FileManagerReact } from 'rad-filemanager';
import 'rad-filemanager/dist/index.css';

const App = () => {
  return (
    <FileManagerReact
      config={{ height: '800px' }}
      header={{
        clientId: '17959574q2f0347718971594ccd86f3f4',
        accessToken: 'ba1bfb8e0b504a05899c319348ec70ac.XzIwMjMy'
      }}
    />
  );
};

export default App;
