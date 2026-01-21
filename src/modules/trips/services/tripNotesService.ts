import { supabaseClient } from '@/src/shared/services/supabase';
import { CreateTripNoteDto, TripNoteResponseDto, UpdateTripNoteDto } from '../data/dto/tripNotes.dto';


export const createTripNote = async (
  tripId: string,
  noteData: CreateTripNoteDto
): Promise<TripNoteResponseDto> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const { data, error } = await supabaseClient
      .from('trip_notes')
      .insert([
        {
          trip_id: tripId,
          user_id: user.id,
          note_date: noteData.note_date,
          title: noteData.title,
          content: noteData.content,
        },
      ])
      .select();

    if (error) {
      console.error('INSERT TRIP NOTE ERROR:', error);
      return {
        success: false,
        error: error.message || 'Note could not be created',
      };
    }

    return {
      success: true,
      data: data?.[0],
    };
  } catch (error: any) {
    console.error('Trip note create error:', error);
    return {
      success: false,
      error: 'An error occurred while creating the note',
    };
  }
};


export const fetchTripNotes = async (tripId: string): Promise<TripNoteResponseDto> => {
  try {
    const { data, error } = await supabaseClient
      .from('trip_notes')
      .select('*')
      .eq('trip_id', tripId)
      .order('note_date', { ascending: true });

    if (error) {
      console.error('FETCH TRIP NOTES ERROR:', error);
      return {
        success: false,
        error: error.message || 'Notes could not be fetched',
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Trip notes fetch error:', error);
    return {
      success: false,
      error: 'An error occurred while fetching notes',
    };
  }
};

export const updateTripNote = async (
  noteId: string,
  updates: UpdateTripNoteDto
): Promise<TripNoteResponseDto> => {
  try {
    const { data, error } = await supabaseClient
      .from('trip_notes')
      .update(updates)
      .eq('id', noteId)
      .select();

    if (error) {
      console.error('UPDATE TRIP NOTE ERROR:', error);
      return {
        success: false,
        error: error.message || 'Note could not be updated',
      };
    }

    return {
      success: true,
      data: data?.[0],
    };
  } catch (error: any) {
    console.error('Trip note update error:', error);
    return {
      success: false,
      error: 'An error occurred while updating the note',
    };
  }
};

export const deleteTripNote = async (noteId: string): Promise<TripNoteResponseDto> => {
  try {
    const { error } = await supabaseClient
      .from('trip_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('DELETE TRIP NOTE ERROR:', error);
      return {
        success: false,
        error: error.message || 'Note could not be deleted',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Trip note delete error:', error);
    return {
      success: false,
      error: 'An error occurred while deleting the note',
    };
  }
};
