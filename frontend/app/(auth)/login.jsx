import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Appearance,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { AppContext } from "@/app/context/AppContext";

export default function LogInScreen() {
  // Navigation router and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Access authentication context
  const { login } = useContext(AppContext);

  // Handle login submission
  const handleLogIn = async () => {
    setError("");

    // Field validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Attempt login and Handle response
    const response = await login(email, password);
    if (response.error) {
      setError(response.error);
    } else {
      router.push("/(tabs)/home");
    }
  };

  // Display the screen with the button and the form
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LOG INTO YOUR ACCOUNT</Text>
      </View>

      <TextInput
        style={styles.button}
        placeholder="Email"
        placeholderTextColor={"pink"}
        onChangeText={setEmail}
        value={email}
      />

      <TextInput
        style={styles.button}
        placeholder="Password"
        placeholderTextColor={"pink"}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <Pressable style={styles.button} onPress={handleLogIn}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.linkAcc}>Don't have an account?</Text>
        <Pressable onPress={() => router.push("/signin")}>
          <Text style={styles.linkSign}>SIGN UP</Text>
        </Pressable>
      </View>

      {/* Error display */}
      {error ? <Text>{error}</Text> : null}
    </SafeAreaView>
  );
}

// Apply styles to the elements
function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: theme.background,
    },

    title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "pink",
      alignItems: "center",
      marginBottom: 20,
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

    header: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },

    linkAcc: {
      fontWeight: "bold",
      fontSize: 15,
    },

    linkSign: {
      fontWeight: "bold",
      color: "pink",
      marginLeft: 5,
      textDecorationLine: "underline",
      fontSize: 15,
    },
  });
}
