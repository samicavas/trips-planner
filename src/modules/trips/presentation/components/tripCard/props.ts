import { Trip } from '@/src/modules/trips/data/dto/trip.dto';

export interface TripCardProps {
  item: Trip;
  onPress: () => void;
  onDelete: (tripId: string | undefined) => void;
}
