export interface TripNote {
  id?: string;
  trip_id: string;
  user_id?: string;
  note_date: string; // YYYY-MM-DD format
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTripNoteDto {
  trip_id: string;
  note_date: string;
  title: string;
  content: string;
}

export interface UpdateTripNoteDto {
  title?: string;
  content?: string;
  note_date?: string;
}

export interface TripNoteResponseDto {
  success: boolean;
  data?: TripNote[] | TripNote;
  error?: string;
}
