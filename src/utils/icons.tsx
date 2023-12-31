import React from 'react';
import upload from '../assets/svg/upload.svg';
import copy from '../assets/svg/copy.svg';
import edit from '../assets/svg/edit.svg';
import folderPlus from '../assets/svg/folder_plus.svg';
import move from '../assets/svg/move.svg';
import paste from '../assets/svg/paste.svg';
import trash from '../assets/svg/trash.svg';
import download from '../assets/svg/download.svg';
import circleInfo from '../assets/svg/circle_info.svg';
import times from '../assets/svg/times.svg';
import tick from '../assets/svg/tick.svg';
import multiSelect from '../assets/svg/multi_select.svg';
import stream from '../assets/svg/stream.svg';

const IconBuilder = ({ src, style = {}, ...props }) => {
  return <img src={src} style={style} {...props} />;
};

export const IconUpload = ({ colorGray = false, size = '', style ={} }) => {
  let styles:React.CSSProperties | undefined  = colorGray
    ? {
        filter:
          'invert(50%) sepia(11%) saturate(6%) hue-rotate(358deg) brightness(87%) contrast(83%)'
      }
    : {};
  if (size) styles.width = size;
  if (style) styles = {...style, ...styles}
  return <IconBuilder src={upload} style={styles} />;
};

export const IconStream = () => {
  return <IconBuilder src={stream} />;
};

export const IconCopy = () => {
  return <IconBuilder src={copy} />;
};

export const IconEdit = () => {
  return <IconBuilder src={edit} />;
};

export const IconFolderPlus = () => {
  return <IconBuilder src={folderPlus} />;
};

export const IconMove = () => {
  return <IconBuilder src={move} />;
};

export const IconPaste = () => {
  return <IconBuilder src={paste} />;
};

export const IconTrash = () => {
  return <IconBuilder src={trash} />;
};

export const IconDownload = () => {
  return <IconBuilder src={download} />;
};

export const IconCircleInfo = () => {
  return <IconBuilder src={circleInfo} />;
};

export const IconTimes = ({ style = {}, ...props }) => {
  return <IconBuilder src={times} style={style} {...props} />;
};

export const IconTick = ({ style = {} }) => {
  return <IconBuilder src={tick} style={style} />;
};

export const IconMultiSelect = ({ style = {} }) => {
  return <IconBuilder src={multiSelect} style={style} />;
};
