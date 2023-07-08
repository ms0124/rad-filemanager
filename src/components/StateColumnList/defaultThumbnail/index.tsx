import React from 'react';
import {
  ImageTypes,
  DocumentTypes,
  AudioTypes,
  VideoTypes
} from '../../../config/types';

import * as FontAwesomeIconTypes from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImage,
  faFileAudio,
  faFileVideo,
  faFileWord,
  faFileExcel,
  faFilePdf,
  faFile,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons';

const Index = ({ item }) => {
  let icon: FontAwesomeIconTypes.IconDefinition;
  switch (item.extension) {
    case ImageTypes.png:
    case ImageTypes.jpeg:
    case ImageTypes.jpg:
    case ImageTypes.svg:
    case ImageTypes.webp:
      icon = faFileImage;
      break;
    case AudioTypes.mp3:
    case AudioTypes.wma:
      icon = faFileAudio;
      break;
    case VideoTypes.mp4:
    case VideoTypes.mpg:
    case VideoTypes.ogg:
      icon = faFileVideo;
      break;
    case DocumentTypes.doc:
    case DocumentTypes.docx:
      icon = faFileWord;
      break;
    case DocumentTypes.pdf:
      icon = faFilePdf;
      break;
    case DocumentTypes.xls:
    case DocumentTypes.xlsx:
      icon = faFileExcel;
      break;
    case DocumentTypes.txt:
      icon = faFileAlt;
    default:
      icon = faFile;
      break;
  }
  return <FontAwesomeIcon icon={icon} size='3x' />;
};

export default Index;
