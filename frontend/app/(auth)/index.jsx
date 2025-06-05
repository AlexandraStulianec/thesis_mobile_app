import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Appearance,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FirstScreen() {
  // Navigation and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Add the into text and the buttons for sign in and log in
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="infinity" size={40} color="black" />
        <Text style={styles.title}>MathTutor</Text>
      </View>

      <Text style={styles.subtitle}>The way</Text>
      <Text style={styles.subtitle}>to learn</Text>
      <Text style={styles.subtitle}> math!</Text>

      <Pressable style={styles.button} onPress={() => router.push("/signin")}>
        <Text style={styles.buttonText}>LET'S GO</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </Pressable>
    </SafeAreaView>
  );
}

//Style the elements in the Screen
function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "pink",
      marginLeft: 10,
    },

    subtitle: {
      fontSize: 25,
      textAlign: "center",
      color: "gray",
      fontWeight: "bold",
    },

    button: {
      marginTop: 10,
      borderRadius: 30,
      borderWidth: 1,
      padding: 10,
      width: "80%",
      alignSelf: "center",
      marginBottom: 15,
      backgroundColor: "gray",
    },

    buttonText: {
      alignSelf: "center",
      color: "pink",
      fontWeight: "600",
    },
  });
}
