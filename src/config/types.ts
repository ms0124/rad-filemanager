export interface Data {
  result: [any] | any;
  message?: [];
  hasError?: Boolean;
  count?: number;
}

export interface BreadcrumbItem {
  hash?: string;
  name?: string;
  attributes?: string[];
  disabled?: boolean;
}

export type StreamSegmentStatus = 'WAITING' | 'PROCESSING' | 'DONE' | 'FAIL';

// هر کیفیت آماده‌سازی‌شده‌ی استریم (360/480/... برای ویدیو و 128/... برای صدا)
export interface StreamQualityStatus {
  hash?: string;
  quality?: string | number;
  segmentStatus?: StreamSegmentStatus;
  streamType?: string;
  created?: string | number;
  updated?: string | number;
  [key: string]: any;
}

// در پاسخ جزئیات فایل، برای فایل استریم‌نشده مقدار streamStatus برابر [] است.
export interface StreamStatus {
  hash?: string;
  // در پاسخ نمونه، segmentStatus فقط داخل هر کیفیت است؛ اگر در سطح بالا هم بیاید استفاده می‌شود.
  segmentStatus?: StreamSegmentStatus;
  streamType?: string;
  created?: string | number;
  updated?: string | number;
  qualities?: StreamQualityStatus[];
  [key: string]: any;
}

export interface DriveItem {
  hash: string;
  name: string;
  extension?: string;
  type?: string;
  parentHash?: string;
  isPublic?: boolean;
  isShared?: boolean;
  isBookmarked?: boolean;
  userCanTrash?: boolean;
  thumbnail?: string;
  size?: number;
  created?: number | string;
  updated?: number | string;
  // با streamStatus=true مقدار دارد؛ در نمونه‌ی واقعی برای فایل استریم‌نشده [] است.
  // ساختار عناصر آن قطعی نیست، پس عمداً شل تایپ شده است.
  streamStatus?: StreamStatus | StreamStatus[] | null;
  [key: string]: any;
}

export interface ChildrenPayload {
  entity?: Record<string, any>;
  list?: DriveItem[];
  breadcrumb?: BreadcrumbItem[];
  count?: number;
  links?: { nextPage?: string; [key: string]: any };
  [key: string]: any;
}

// پاسخ خام سرویس children؛ با arrayResponseFormat=true مقدار result آرایه است
// و آبجکت list/breadcrumb در result[0] قرار می‌گیرد.
export interface ChildrenResponse {
  hasError?: boolean;
  count?: number;
  result?: ChildrenPayload | ChildrenPayload[];
  metaData?: any[];
  [key: string]: any;
}

// شکل نرمال‌شده‌ای که به کامپوننت‌ها داده می‌شود تا به ساختار آرایه‌ای وابسته نباشند.
export interface ChildrenPage {
  count: number;
  result: ChildrenPayload;
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
  RestoreArchive = 9,
  Share = 10,
  Preview = 11
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
