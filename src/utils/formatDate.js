import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

export const formatMessageTimeDetailed = (timestamp) => {
  const date = new Date(timestamp);
  return format(date, 'EEEE, MMMM do, yyyy \'at\' HH:mm');
};

export const formatLastSeen = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
