import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    'Onest': require('../assets/Onest-VariableFont_wght.ttf')
  });
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: true, headerTransparent: true, }} />
        <Stack.Screen name="logIn" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 
            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
        <Stack.Screen name="vinEnter" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 
            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
