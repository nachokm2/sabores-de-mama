import { getDay } from 'date-fns';

export const getAvailableDays = (commune: string): number[] => {
  switch (commune) {
    case 'Providencia':
      return [1, 6]; // Monday, Saturday
    case 'Lo Barnechea':
    case 'Vitacura':
    case 'San Miguel':
      return [2, 4, 6]; // Tuesday, Thursday, Saturday
    case 'Ñuñoa':
      return [3, 6]; // Wednesday, Saturday
    case 'Las Condes':
      return [5, 6]; // Friday, Saturday
    default:
      return [];
  }
};

export const getAvailableTimes = (commune: string, date: Date) => {
  const dayOfWeek = getDay(date);

  if (dayOfWeek === 6) { // Saturday
    return [{ time: '09:30 - 10:00 AM', note: 'Único servicio' }];
  }
  
  if (dayOfWeek === 1 && commune === 'Providencia') { // Monday
    return [
      { time: '09:00 AM', note: 'Primer servicio' },
      { time: '15:00 PM', note: 'Segundo servicio. El horario de llegada puede variar dependiendo de la duración del primer servicio.' }
    ];
  }
  
  if ((dayOfWeek === 2 || dayOfWeek === 4) && ['Lo Barnechea', 'Vitacura', 'San Miguel'].includes(commune)) { // Tue, Thu
    return [{ time: '09:30 - 10:00 AM', note: 'Único servicio' }];
  }
  
  if (dayOfWeek === 3 && commune === 'Ñuñoa') { // Wednesday
    return [{ time: '09:00 a 10:00 AM', note: 'Único servicio' }];
  }
  
  if (dayOfWeek === 5 && commune === 'Las Condes') { // Friday
    return [{ time: '09:00 a 10:00 AM', note: 'Único servicio' }];
  }
  
  return [];
};
