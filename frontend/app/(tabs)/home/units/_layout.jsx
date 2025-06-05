import { Stack, Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";

export default function UnitsLayout() {
  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.headerBackground },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="unit1" options={{ headerShown: false }} />
      <Stack.Screen name="unit2" options={{ headerShown: false }} />
      <Stack.Screen name="unit3" options={{ headerShown: false }} />
      <Stack.Screen name="unit1_theory" options={{ headerShown: false }} />
      <Stack.Screen name="unit2_theory" options={{ headerShown: false }} />
      <Stack.Screen name="unit3_theory" options={{ headerShown: false }} />
    </Stack>
  );
}
