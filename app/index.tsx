import SignInPage from '@/src/modules/auth/presentation/pages/SignInPage';
import { getCurrentSession } from '@/src/modules/auth/services/authService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await getCurrentSession();
      if (response.success && response.data?.user) {
        router.replace('/screens/TripsScreen' as any);
      } else {
        router.replace('/screens/SignInScreen' as any);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return <SignInPage />;
}
