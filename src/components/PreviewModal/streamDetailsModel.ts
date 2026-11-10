// eslint-disable-next-line no-unused-vars
import { StreamQualityStatus, StreamStatus } from '../../config/types';

const STATUS_LABELS: Record<string, string> = {
  WAITING: 'در انتظار',
  PROCESSING: 'در حال پردازش',
  DONE: 'انجام‌شده',
  FAIL: 'ناموفق'
};

const STREAMING_EXTENSIONS = ['mp3', 'mp4'];

export const getStatusLabel = (status?: string): string => {
  if (!status) {
    return '-';
  }

  return STATUS_LABELS[String(status).toUpperCase()] || String(status);
};

// برای فایل استریم‌نشده، streamStatus در پاسخ جزئیات برابر [] است.
export const getStream = (
  streamStatus?: StreamStatus | StreamStatus[] | null
): StreamStatus | undefined => {
  if (Array.isArray(streamStatus)) {
    return streamStatus[0];
  }
  return streamStatus || undefined;
};

export const getQualities = (stream?: StreamStatus): StreamQualityStatus[] => {
  const qualities = stream?.qualities;
  return Array.isArray(qualities) ? qualities.filter(Boolean) : [];
};

export const hasStreamDetails = (
  streamStatus?: StreamStatus | StreamStatus[] | null,
  extension?: string
): boolean => {
  if (!STREAMING_EXTENSIONS.includes((extension || '').toLowerCase())) {
    return false;
  }

  const stream = getStream(streamStatus);
  return !!stream && getQualities(stream).length > 0;
};
