import moment from 'moment-jalaali';

// تاریخ‌ها در پاسخ‌های API هم عدد (ثانیه یا میلی‌ثانیه) و هم رشته‌ی ISO هستند.
const toMilliseconds = (timestamp: number): number =>
  timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp;

const toTimestamp = (value?: string | number | null): number => {
  if (value === null || value === undefined || value === '') {
    return NaN;
  }

  if (typeof value === 'number') {
    return toMilliseconds(value);
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    return toMilliseconds(numeric);
  }

  return moment(value).valueOf();
};

export const formatJalaliDate = (value?: string | number | null): string => {
  const timestamp = toTimestamp(value);
  return Number.isNaN(timestamp)
    ? '-'
    : moment(timestamp).format('jYYYY/jMM/jDD');
};

export const formatJalaliTime = (value?: string | number | null): string => {
  const timestamp = toTimestamp(value);
  return Number.isNaN(timestamp) ? '-' : moment(timestamp).format('HH:mm');
};
