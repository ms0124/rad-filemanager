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

const IconBuilder = ({ src, style = {} }) => {
  return <img src={src} style={style} />;
};

export const IconUpload = ({ colorGray = false, size = '' }) => {
  const style: { filter?: string; width?: string } = colorGray
    ? {
        filter:
          'invert(50%) sepia(11%) saturate(6%) hue-rotate(358deg) brightness(87%) contrast(83%)'
      }
    : {};
  if (size) {
    style.width = size;
  }
  return <IconBuilder src={upload} style={style} />;
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
  return <IconBuilder src={circleInfo} />
}