export interface Trip {
  id?: string;
  user_id?: string;
  title: string;
  destination: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddTripDto {
  title: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTripDto {
  title: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface TripResponseDto {
  success: boolean;
  data?: Trip[] | Trip;
  error?: string;
}
