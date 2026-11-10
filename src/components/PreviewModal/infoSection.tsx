import React from 'react';
import styles from './style.module.scss';
import { formatJalaliDate, formatJalaliTime } from './formatters';

export interface SidebarItemProps {
  label?: string;
  value?: string | React.ReactNode;
}

export const SidebarItem: React.FunctionComponent<SidebarItemProps> = ({
  label,
  value
}) => {
  return (
    <div className={styles['info-section__sidebar-item']}>
      <span>{label}</span>
      <span className={styles['info-section__sidebar-value']}>{value}</span>
    </div>
  );
};

interface InfoSectionCardProps {
  title: string;
  children?: React.ReactNode;
}

// کارت مشترک بخش‌های پنل جزئیات (تاریخچه تغییرات / جزئیات استریم) تا ظاهر یکسان بماند.
export const InfoSectionCard: React.FunctionComponent<InfoSectionCardProps> = ({
  title,
  children
}) => {
  return (
    <div className={styles['info-section__log-card']}>
      <span className={styles['info-section__log-title-wrapper']}>{title}</span>
      {children}
    </div>
  );
};

interface InfoSectionItemProps {
  children?: React.ReactNode;
}

export const InfoSectionItem: React.FunctionComponent<InfoSectionItemProps> = ({
  children
}) => {
  return <div className={styles['info-section__item-wrapper']}>{children}</div>;
};

interface DateTimeValueProps {
  value?: string | number | null;
}

export const DateTimeValue: React.FunctionComponent<DateTimeValueProps> = ({
  value
}) => {
  if (value === undefined || value === null || value === '') {
    return <span>-</span>;
  }

  return (
    <div className={styles['info-section__log-card-item']}>
      <span>{formatJalaliDate(value)}</span>
      {/* همین ساختار و متن در «تاریخچه تغییرات» استفاده شده است */}
      {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
      {`: ساعت`}
      &nbsp;
      <span>{formatJalaliTime(value)}</span>
    </div>
  );
};
