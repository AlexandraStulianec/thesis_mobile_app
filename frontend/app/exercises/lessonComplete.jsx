import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, Pressable, Appearance } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ConfettiCannon from "react-native-confetti-cannon"; // For confetti animation
import { Colors } from "@/constants/Colors";
import { AppContext } from "../context/AppContext";

export default function LessonComplete() {
  // Theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Extract route parameters
  const { unitId, lessonId, xp } = useLocalSearchParams();

  // Access global state
  const { completed_lessons, current_lesson, current_unit, updateStats } =
    useContext(AppContext);

  const [showConfetti, setShowConfetti] = useState(true);
  const [totalXp, setTotalXp] = useState(xp);

  const completeLesson = async (unitId, lessonId) => {
    const lessonKey = `lesson_${unitId}_${lessonId}`;
    const lessonNumber = parseInt(lessonId, 10); // Convert to number

    if (completed_lessons.includes(lessonKey)) {
      console.log(`${lessonKey} already completed.`);
      return; // Don't update if already completed
    }

    // Prepare new progression state
    const newCompletedLessons = [...completed_lessons, lessonKey];

    let newLesson = current_lesson;
    let newUnit = current_unit;

    // Advance to next lesson
    if (lessonNumber === current_lesson) {
      // Use converted number
      newLesson = current_lesson + 1;
      console.log(newLesson);
    }

    // Advance to next unit if needed
    if (newLesson > 5) {
      newUnit = current_unit + 1;
      newLesson = 1;
    }

    // Update global state
    await updateStats({
      completed_lessons: newCompletedLessons,
      current_lesson: newLesson,
      current_unit: newUnit,
    });

    console.log(`Updated to lesson ${newLesson}, unit ${newUnit}`);
  };

  useEffect(() => {
    setTotalXp(parseInt(xp));

    // Hide confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer); // Cleanup the timer
  }, [xp]);

  // Return to home screen after completion
  const handleBackToHome = async () => {
    // Complete the lesson and update the context
    await completeLesson(unitId, lessonId[0]);
    router.push(`/home`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.lessonComplete}>LESSON COMPLETE!</Text>
      <Text style={styles.goodJob}>GOOD JOB! </Text>
      <Text style={styles.goodJob}>
        {" "}
        You finished lesson {lessonId[0]} from unit {unitId}{" "}
      </Text>
      <Text style={styles.totalXp}>You have {totalXp} XP!</Text>
      <Pressable style={styles.button} onPress={handleBackToHome}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </Pressable>

      {/* Confetti animation */}
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }} // Adjust the origin for confetti
          fadeOut // Gradually fades out the confetti
        />
      )}
    </View>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    lessonComplete: {
      fontSize: 24,
      fontWeight: "bold",
      color: "black",
    },
    goodJob: {
      fontSize: 20,
      marginBottom: 10,
    },
    totalXp: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
    },
    button: {
      padding: 10,
      backgroundColor: "green",
      borderRadius: 10,
      alignItems: "center",
      width: "70%",
    },
    buttonText: {
      color: "black",
      fontWeight: "bold",
    },
  });
}
