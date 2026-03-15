export type BookingData = {
  portions: number;
  burners: number;
  restrictions: string;
  commune: string;
  date: Date | null;
  timeSlot: string | null;
  timeNote: string | null;
  agreedToPolicy: boolean;
};

export const COMMUNES = [
  'Providencia',
  'Lo Barnechea',
  'Vitacura',
  'San Miguel',
  'Ñuñoa',
  'Las Condes'
];
