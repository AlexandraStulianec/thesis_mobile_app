import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  SafeAreaView,
  Appearance,
  FlatList,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { fetchExercises } from "../../../api/fetch_handler";
import { AppContext } from "@/app/context/AppContext";

export default function Unit3Exercises() {
  // Navigation and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  const { unitId } = useLocalSearchParams(); // This will grab the unitId from the URL

  const { completed_lessons } = useContext(AppContext);

  const [lessons, setLessons] = useState([]);

  // Load exercises for this unit
  useEffect(() => {
    const loadExercises = async () => {
      const data = await fetchExercises(unitId); // Fetch all lessons for unit 1
      setLessons(data);
    };

    loadExercises();
  }, []);

  if (lessons.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const isLessonUnlocked = (lessonId) => {
    // First lesson is always unlocked
    if (lessonId === 1) return true;

    // Check if the previous lesson is completed
    const previousLessonKey = `lesson_${unitId}_${lessonId - 1}`;
    return completed_lessons.includes(previousLessonKey);
  };

  // Handle lesson press, enforce lock if needed
  const handleLessonPress = (lessonId) => {
    if (!isLessonUnlocked(lessonId)) {
      alert("This lesson is locked! Complete the previous one to unlock it.");
      return;
    }
    router.push(`/exercises/${unitId}/${lessonId}`);
  };

  // Render each lesson
  const renderLessonItem = ({ item }) => {
    const isUnlocked = isLessonUnlocked(item.lesson_id);

    return (
      <Pressable
        style={[styles.lessonRow, !isUnlocked && styles.lockedLesson]}
        onPress={() => handleLessonPress(item.lesson_id)}
      >
        <Text style={[styles.lessonTitle, !isUnlocked && styles.lockedText]}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.menuItemTitle}>UNIT 4</Text>
          <Text style={styles.menuItemText}>Undeterminded Cases</Text>
        </View>

        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("/(tabs)/home/units/unit3_theory")}
        >
          <Text style={styles.headerButtonText}>TH</Text>
        </Pressable>
      </View>

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={renderLessonItem}
        contentContainerStyle={styles.contentContainer}
      />
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
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: "pink",
    },

    headerButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      width: "5%%",
      alignItems: "center",
      marginRight: 20,
      backgroundColor: "rgb(173, 216, 230)",
    },

    headerButtonText: {
      fontSize: 20,
      fontWeight: "bold",
    },

    menuItemTitle: {
      fontSize: 20,
      textDecorationLine: "underline",
      textAlign: "left",
      paddingBottom: 10,
      fontWeight: "bold",
    },

    menuItemText: {
      color: theme.text,
      textAlign: "center",
      fontWeight: "600",
      textAlign: "left",
      fontSize: 16,
    },

    contentContainer: {
      paddingTop: 130,
      paddingBottom: 20,
      paddingHorizontal: 12,
    },

    lessonRow: {
      flexDirection: "row",
      padding: 15,
      marginBottom: 10,
      borderRadius: 20,
      borderWidth: 2,
      backgroundColor: theme.cardBackground,
      alignItems: "center",
      justifyContent: "space-between",
    },
    lockedLesson: {
      backgroundColor: "lightgray",
    },
    lessonTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    lockedText: {
      color: "gray",
    },
  });
}
