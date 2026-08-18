export interface Tea {
  id: string;
  name: string;
  active: boolean;
}

export interface Reservation {
  id: string;
  user_id: string;
  reservation_date: string;
  start_time: string;
  guest_count: number;
  tea_id?: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
}
