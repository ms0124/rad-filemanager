import React from 'react';
// eslint-disable-next-line no-unused-vars
import { StreamStatus } from '../../config/types';
import {
  DateTimeValue,
  InfoSectionCard,
  InfoSectionItem,
  SidebarItem
} from './infoSection';
import {
  getQualities,
  getStatusLabel,
  getStream,
  hasStreamDetails
} from './streamDetailsModel';

interface StreamDetailsProps {
  streamStatus?: StreamStatus | StreamStatus[] | null;
  extension?: string;
  isLoading?: boolean;
  isError?: boolean;
}

const StreamDetails: React.FunctionComponent<StreamDetailsProps> = ({
  streamStatus,
  extension,
  isLoading = false,
  isError = false
}) => {
  // در حالت لودینگ و خطا (و نبود streamStatus یا کیفیت) بخش نمایش داده نمی‌شود.
  if (isLoading || isError || !hasStreamDetails(streamStatus, extension)) {
    return null;
  }

  const stream = getStream(streamStatus) as StreamStatus;
  const qualities = getQualities(stream);

  return (
    <InfoSectionCard title='جزئیات استریم'>
      {qualities.map((quality, index) => (
        <InfoSectionItem
          key={`${quality.quality}-${quality.streamType}-${index}`}
        >
          <SidebarItem
            label='کیفیت‌های آماده‌سازی شده'
            value={
              quality.quality === undefined || quality.quality === null
                ? '-'
                : String(quality.quality)
            }
          />
          <SidebarItem
            label='وضعیت آماده‌سازی استریم'
            value={getStatusLabel(quality.segmentStatus)}
          />
          <SidebarItem
            label='تاریخ درخواست'
            value={<DateTimeValue value={quality.created} />}
          />
          <SidebarItem
            label='تاریخ ایجاد استریم'
            value={<DateTimeValue value={quality.updated} />}
          />
        </InfoSectionItem>
      ))}
    </InfoSectionCard>
  );
};

export default StreamDetails;
