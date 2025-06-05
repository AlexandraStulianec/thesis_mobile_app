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

export default function SignInScreen() {
  // Navigation router and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Form state management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Access authentication context
  const { signin } = useContext(AppContext);

  // Handle registration submission
  const handleSignIn = async () => {
    setError(""); // Clear previous errors

    // Field Validations
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Attempt registration and Handle response
    const response = await signin(name, email, password);
    if (response.error) {
      setError(response.error);
    } else {
      router.push("/(auth)/login");
    }
  };

  //Display the screen with the text and form
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CREATE YOUR PROFILE</Text>
      </View>

      <TextInput
        style={styles.button}
        placeholder="Name"
        placeholderTextColor={"pink"}
        onChangeText={setName}
        value={name}
      />
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

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.linkAcc}>Have an account?</Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.linkLog}>LOG IN</Text>
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

    linkLog: {
      fontWeight: "bold",
      color: "pink",
      marginLeft: 5,
      textDecorationLine: "underline",
      fontSize: 15,
    },
  });
}
