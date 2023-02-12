import React, { FunctionComponent } from 'react';
import { FileManagerReact } from './index';

const App: FunctionComponent = () => {
  return (
    <FileManagerReact
      header={{
        accessToken: '030c42facbe043019c00f251cd57245c.XzIwMjMy',
        clientId: '17959574q2f0347718971594ccd86f3f4'
      }}
      config={{ height: '500px' }}
    />
  );
  // return <div>1234567890</div>;
};

export default App;
