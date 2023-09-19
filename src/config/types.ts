export interface Data {
  result: [any] | any;
  message?: [];
  hasError?: Boolean;
  count?: number;
}

/************************
 ******T Y P E S *********
 *************************/

export enum OperationTypes {
  NewFolder = 1,
  Remove = 2,
  Rename = 3,
  Cut = 4,
  Copy = 5,
  Paste = 6,
  Download = 7,
  RemoveArchive = 8,
  RestoreArchive = 9
}

export enum TabTypes {
  FileList = 1,
  ArchiveList = 2,
  SearchList = 3
}

export enum FolderTypes {
  folder = 'application/vnd.podspace.folder'
}
export enum ImageTypes {
  png = 'png',
  jpeg = 'jpeg',
  jpg = 'jpg',
  webp = 'webp',
  svg = 'svg'
}
export enum VideoTypes {
  mpg = 'mpg',
  mp4 = 'mp4',
  ogg = 'ogg'
}
export enum AudioTypes {
  mp3 = 'mp3',
  wma = 'wma'
}
export enum DocumentTypes {
  doc = 'doc',
  docx = 'docx',
  pdf = 'pdf',
  xls = 'xls',
  xlsx = 'xlsx',
  txt = 'txt'
}

export enum OrderByTypes {
  Updated = 'UPDATED',
  Created = 'CREATED',
  Name = 'NAME',
  Size = 'SIZE',
  Type = 'TYPE'
}
