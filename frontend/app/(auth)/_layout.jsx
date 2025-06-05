import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Appearance } from 'react-native';

export default function AuthLayout() {
  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === 'dark'? Colors.dark : Colors.light;

  return (
      <Stack screenOptions={{headerStyle:{backgroundColor: theme.headerBackground },
      headerTintColor: theme.text,
      headerShadowVisible: false
      }}>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="signin" options={{ headerShown: false}} />
        <Stack.Screen name="login" options={{ headerShown: false}} />
      </Stack>
  );
}