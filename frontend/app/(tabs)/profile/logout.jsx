import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Appearance,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { AppContext } from "@/app/context/AppContext";

export default function LogOutScreen() {
  //Navigation router and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Control modal and potential errors
  const [modalVisible, setModalVisible] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useContext(AppContext);

  // Handle logout
  const handleLogOut = async () => {
    setError(""); // clear previous errors

    const response = await logout(); // Call logout function

    if (response.error) {
      setError(response.error); // Set error if it exists
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        //Close modal and go back to profile
        router.push("/profile");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Logout Account?</Text>
          <Text style={styles.subtitle}>
            Are you sure you want to log out of your account?
          </Text>
          <Pressable
            style={styles.logOutButton}
            onPress={async () => {
              handleLogOut(); // Call function properly
              setModalVisible(!modalVisible); // Close modal
              router.push("/(auth)"); // Navigate to authentication screen
            }}
          >
            <Text style={styles.logOutButtonText}>Logout</Text>
          </Pressable>
          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              router.push("/profile");
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>

          {error ? <Text testID="logoutError">{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

//Apply styles to the elements
function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },

    modalContainer: {
      width: "80%",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },

    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },

    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
    },

    logOutButton: {
      borderRadius: 30,
      borderWidth: 1,
      padding: 10,
      width: "80%",
      alignSelf: "center",
      backgroundColor: "red",
      marginBottom: 15,
    },

    logOutButtonText: {
      alignSelf: "center",
      color: "white",
    },

    cancelButton: {
      borderRadius: 30,
      borderWidth: 1,
      padding: 10,
      width: "80%",
      alignSelf: "center",
    },

    cancelButtonText: {
      alignSelf: "center",
    },
  });
}
