import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";

export default function AuthLayout() {
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
      <Stack.Screen
        name="[unitId]/[lessonId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="lessonComplete" options={{ headerShown: false }} />
    </Stack>
  );
}
