import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { JsStack } from '@/components/JsStack';
import { Easing } from "react-native-reanimated";
const ANIMATION_DURATION = 550;
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
      <JsStack
      screenOptions={{
        headerShown: false,
        cardOverlayEnabled: true, // Enable card overlay for transitions
        gestureEnabled: true, // Enable gesture-based navigation
        cardStyleInterpolator: ({ current, next, layouts }) => {
          const INITIAL_TRANSLATE_X_MULTIPLIER = 1.6;
          const NEXT_TRANSLATE_X_MULTIPLIER = -0.3;

          // Calculate translateX for the current screen
          const translateX = current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [
              INITIAL_TRANSLATE_X_MULTIPLIER * layouts.screen.width,
              0,
            ],
            extrapolate: "clamp",
          });

          
          // Calculate translateX for the next screen (if exists)
          const nextTranslateX = next
            ? next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  0,
                  NEXT_TRANSLATE_X_MULTIPLIER * layouts.screen.width,
                ],
                extrapolate: "clamp",
              })
            : 0;

          const transform = [
            { translateX },
            { translateX: nextTranslateX },
          ];

          return {
            cardStyle: { transform },
          };
        },
      }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ headerShown: true, headerTransparent: true, }} />
        <Stack.Screen name="vinEnter" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 
            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
        <Stack.Screen name="createAccount" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 
            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
        <Stack.Screen name="carNameEnter" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 

            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
        <Stack.Screen name="index" options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '', 
            headerBackTitle: 'Back',
            headerTintColor: '#fff',    // back button color
          }}
        />
      </JsStack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
