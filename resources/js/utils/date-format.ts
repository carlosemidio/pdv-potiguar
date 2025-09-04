export function dateFromISO(date: string): string {
    return date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0];
}

export const formatDate = (date: string) => {
  let locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const utcDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const localDate = utcDate.toLocaleString(locale, options);

    return localDate;
}

export const formatDateTime = (_date: string) => {
  let locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const date = new Date(_date);

  const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };

  const localDate = date.toLocaleDateString(locale, options);
  const localTime = date.toLocaleTimeString(locale, options);
  return `${localDate} ${localTime}`;
}
export const formatCustomDateTime = (_date: string) => {
  const date = new Date(_date);

  const year = date.getFullYear().toString().slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};