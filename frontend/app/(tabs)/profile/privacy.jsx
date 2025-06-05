import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Appearance,
  Image,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import anonym from "@/assets/images/anonym.png";
import { AppContext } from "@/app/context/AppContext";

export default function PrivacyScreen() {
  // Theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);

  // Access user name and update function from context
  const { name, updateStats } = useContext(AppContext);

  // Store new name input
  const [newName, setNewName] = useState("");

  // Save updated name
  const handleSaveName = async () => {
    if (newName) {
      await updateStats({ name: newName });
      setNewName("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuItemTitle}>My Profile</Text>
      </View>

      <View style={styles.profileInfo}>
        <Image
          source={anonym}
          style={styles.iconPicture}
          testID="profileImage"
        ></Image>
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.form}>
        <Text>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new name"
          value={newName}
          onChangeText={setNewName}
        />

        <Pressable style={styles.saveButton} onPress={handleSaveName}>
          <Text>Save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Apply styles to the elements
function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      backgroundColor: "gray",
      justifyContent: "center",
      position: "relative",
    },

    menuItemTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    backButton: {
      position: "absolute",
      left: 16,
    },

    iconPicture: {
      width: 100,
      height: 100,
      borderRadius: 70,
    },

    name: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 5,
    },

    profileInfo: {
      flexDirection: "column",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 10,
      paddingLeft: 5,
      paddingRight: 15,
      marginBottom: 40,
    },

    input: {
      borderRadius: 10,
      borderWidth: 1,
      padding: 10,
    },

    form: {
      marginTop: 20,
      alignSelf: "center",
      width: "80%",
    },

    saveButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: "lightblue",
      borderRadius: 5,
      alignItems: "center",
    },
  });
}
