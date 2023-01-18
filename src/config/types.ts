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
  Download = 7
}
