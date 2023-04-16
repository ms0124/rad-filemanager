# rad-filemanager

> rad filemanager

[![NPM](https://img.shields.io/npm/v/rad-filemanager.svg)](https://www.npmjs.com/package/rad-filemanager) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save rad-filemanager
```

## Usage

```tsx
import React, { Component } from 'react';
import FileManagerReact from 'rad-filemanager';

const App: React.FunctionComponent = () => {
  return (
    <FileManagerReact
      header={{
        clientId: '17959574q2f0347718971594ccd86f3f4',
        accessToken: '22c023053ef746e48df1abca06392e39.XzIwMjM0'
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
```

## Development

```bash
  npm run serve
```

## Props

> header

- type : object
- Description : send clientId and accessToken with any request.

```bash
{
  clientId: '17959574q2f0347718971594ccd86f3f4',
  accessToken: '22c023053ef746e48df1abca06392e39.XzIwMjM0'
}
```

> permissions

- type : string[]
- description: all of the permissions which your app have access to them.

```bash
[
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
]
```

> config

- type: object
- description: height have default value
  (100%).
- defult value : height: 100%
```bash
  {
    height: "400px"
  }

```

## License

MIT © [](https://github.com/)
