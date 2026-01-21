import { supabaseClient } from '@/src/shared/services/supabase';
import { Trip, TripResponseDto } from '../data/dto/trip.dto';

export const insertTrip = async (trip: Trip): Promise<TripResponseDto> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'Not found user',
      };
    }

    const { data, error } = await supabaseClient
      .from('trips')
      .insert([
        {
          user_id: user.id,
          title: trip.title,
          destination: trip.destination,
          description: trip.description || '',
          start_date: trip.start_date,
          end_date: trip.end_date,
        },
      ])
      .select();

    if (error) {
      console.error('INSERT ERROR:', error);
      return {
        success: false,
        error: error.message || 'Trip could not be added',
      };
    }

    return {
      success: true,
      data: data?.[0],
    };
  } catch (error: any) {
    console.error('Trip insert error:', error);
    return {
      success: false,
      error: 'An error occurred while adding the trip',
    };
  }
};

export const fetchUserTrips = async (): Promise<TripResponseDto> => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User fetch error:', userError);
      return {
        success: false,
        error: 'User not found',
      };
    }

    console.log('Fetching trips for user:', user.id);

    const { data, error } = await supabaseClient
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('FETCH ERROR:', error);
      return {
        success: false,
        error: error.message || 'Trips could not be fetched',
      };
    }

    console.log('TRIPS FETCHED:', data);

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Trip fetch error:', error);
    return {
      success: false,
      error: 'An error occurred while fetching trips',
    };
  }
};

export const updateTrip = async (
  tripId: string,
  updates: Partial<Trip>
): Promise<TripResponseDto> => {
  try {
    const { data, error } = await supabaseClient
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select();

    if (error) {
      return {
        success: false,
        error: error.message || 'Trip could not be updated',
      };
    }

    return {
      success: true,
      data: data?.[0],
    };
  } catch (error: any) {
    console.error('Trip update error:', error);
    return {
      success: false,
      error: 'An error occurred while updating the trip',
    };
  }
};

export const deleteTrip = async (tripId: string): Promise<TripResponseDto> => {
  try {
    const { error } = await supabaseClient
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) {
      console.error('DELETE ERROR:', error);
      return {
        success: false,
        error: error.message || 'Trip could not be deleted',
      };
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Trip delete error:', error);
    return {
      success: false,
      error: 'An error occurred while deleting the trip',
    };
  }
};
