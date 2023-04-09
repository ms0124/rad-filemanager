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
