import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Linking from 'expo-linking';
import { Stack } from "expo-router";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      try {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get('code');
      } catch (error) {
        console.error('Deep link error:', error);
      }
    };

    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    Linking.getInitialURL().then((url) => {
      if (url != null) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
