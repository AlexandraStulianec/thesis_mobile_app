import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Appearance,
  Image,
  Pressable,
} from "react-native";
import { Colors } from "@/constants/Colors";
import anonym from "@/assets/images/anonym.png";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { AppContext } from "@/app/context/AppContext";

export default function ProfileScreen() {
  // Navigation and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Access user data from context
  const { xp, current_unit, current_lesson, name } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <Header></Header>

      <View style={styles.profileInfo}>
        <Image source={anonym} style={styles.iconPicture}></Image>
        <Text style={styles.name}>{name}</Text>
        <Pressable
          onPress={() => router.push("/profile/privacy")}
          testID="editButton"
        >
          {/* Navigate to privacy settings */}
          <FontAwesome name="edit" size={24} color="black" />
        </Pressable>
      </View>

      {/* Dashboard section showing XP, current lesson, and unit */}
      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        <View style={styles.dashBox}>
          <Text style={styles.dashValue}>{xp}</Text>
          <Text style={styles.dashLabel}>XP</Text>
        </View>
        <View style={styles.dashBox}>
          <Text style={styles.dashValue}>{current_lesson}</Text>
          <Text style={styles.dashLabel}>Current Lesson</Text>
        </View>
        <View style={styles.dashBox}>
          <Text style={styles.dashValue}>{current_unit}</Text>
          <Text style={styles.dashLabel}>Current Unit</Text>
        </View>
      </View>

      <View style={styles.dashboard}>
        <Text style={styles.dashboardTitle}>My account</Text>

        <View style={styles.dashBox}>
          <Pressable onPress={() => router.push("/profile/privacy")}>
            <Text style={styles.linkP}>Privacy</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/profile/logout")}>
            <Text style={styles.linkL}>Logout</Text>
          </Pressable>
        </View>
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
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 10,
      backgroundColor: "gray",
      paddingBottom: 15,
      paddingTop: 15,
    },

    menuItemTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    iconPicture: {
      width: 70,
      height: 70,
      borderRadius: 70,
    },

    name: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 5,
    },

    profileInfo: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 10,
      paddingLeft: 5,
      paddingRight: 15,
      marginBottom: 40,
    },

    dashboard: {
      flexDirection: "column",
      justifyContent: "space-around",
      padding: 10,
      borderRadius: 20,
      marginTop: 20,
      borderWidth: 1,
      width: "80%",
      alignSelf: "center",
      marginBottom: 40,
    },

    dashboardTitle: {
      fontSize: 17,
      fontWeight: "bold",
      marginLeft: 10,
    },

    dashBox: {
      alignItems: "center",
    },

    dashValue: {
      fontSize: 16,
      fontWeight: "bold",
    },

    dashLabel: {
      fontSize: 14,
    },

    linkP: {
      color: "blue",
      fontSize: 16,
      marginVertical: 10,
    },

    linkL: {
      color: "red",
      fontSize: 16,
    },
  });
}
