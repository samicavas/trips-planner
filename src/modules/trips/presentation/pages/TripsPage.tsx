import { getCurrentSession, signOut } from '@/src/modules/auth/services/authService';
import { Trip } from '@/src/modules/trips/data/dto/trip.dto';
import { tripsStyles } from '@/src/modules/trips/presentation/styles/trips.styles';
import {
  deleteTrip,
  fetchUserTrips,
} from '@/src/modules/trips/services/tripsService';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TripCard } from '../components/tripCard';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadSession();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadSession = async () => {
    try {
      const response = await getCurrentSession();
      if (response.success && response.data?.user) {
        setUserEmail(response.data.user.email || '');
      } else {
        router.replace('/' as any);
      }
    } catch (error) {
      console.error('Session error:', error);
      router.replace('/' as any);
    }
  };

  const loadTrips = async () => {
    try {
      setLoading(true);
      const response = await fetchUserTrips();

      if (response.success && Array.isArray(response.data)) {
        setTrips(response.data as Trip[]);
      } else {
        console.error('Failed to fetch trips:', response.error);
      }
    } catch (error) {
      console.error('Trips load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string | undefined) => {
    if (!tripId) return;

    Alert.alert('Delete', 'Are you sure you want to delete this trip plan?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const response = await deleteTrip(tripId);
            if (response.success) {
              setTrips(trips.filter((trip) => trip.id !== tripId));
              Alert.alert('Success', 'Trip plan deleted');
            } else {
              Alert.alert('Error', response.error || 'Error occurred while deleting');
            }
          } catch (error) {
            Alert.alert('Error', 'An error occurred while deleting');
          }
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          try {
            const response = await signOut();
            if (response.success) {
              router.replace('/' as any);
            } else {
              Alert.alert('Error', response.error?.message || 'Sign out failed');
            }
          } catch (error) {
            Alert.alert('Error', 'An error occurred during sign out');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={tripsStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={tripsStyles.container}>
      {/* Header */}
      <View style={tripsStyles.pageHeader}>
        <View style={tripsStyles.headerInfo}>
          <Text style={tripsStyles.tripsPageHeaderTitle}>My Trips</Text>
          <Text style={tripsStyles.headerEmail}>{userEmail}</Text>
        </View>
        <TouchableOpacity style={tripsStyles.logoutBtn} onPress={handleSignOut}>
          <Text style={tripsStyles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tripsStyles.content}>
        {/* Add Trip Button */}
        <TouchableOpacity
          style={tripsStyles.addTripBtn}
          onPress={() =>
            router.push('/screens/AddTripScreen' as any)
          }
        >
          <Text style={tripsStyles.addTripBtnText}>+ New Trip Plan</Text>
        </TouchableOpacity>

        {/* Trips List */}
        {trips.length === 0 ? (
          <View style={tripsStyles.emptyStateContainer}>
            <Text style={tripsStyles.emptyStateTitle}>
              No trip plans yet
            </Text>
            <Text style={tripsStyles.emptyStateSubtitle}>
              Start by creating a new trip plan
            </Text>
          </View>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(item, index) => item.id || index.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TripCard
                item={item}
                onPress={() => {
                  router.push({
                    pathname: '/screens/EditTripScreen',
                    params: {
                      id: item.id,
                      data: JSON.stringify(item),
                    },
                  });
                }}
                onDelete={handleDeleteTrip}
              />
            )}
          />
        )}
      </ScrollView>
    </View>
  );
}
