import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Appearance } from "react-native";

export default function ProfileLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="logout"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen name="privacy" options={{ headerShown: false }} />
      {/* <Stack.Screen name="profile" options={{ headerShown: false}} /> */}
    </Stack>
  );
}
