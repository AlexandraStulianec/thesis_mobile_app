import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Modal,
  Appearance,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { fetchExercises } from "../../api/fetch_handler";
import { explainMistake } from "../../api/ai_handler";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";
import { AppContext } from "@/app/context/AppContext";

export default function ExerciseScreen() {
  // Extract route parameters for current unit and lesson
  const { unitId, lessonId } = useLocalSearchParams();

  // Navigation and theme setup
  const router = useRouter();
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme);

  // State management
  const [exercises, setExercises] = useState([]); // All exercises for lesson
  const [currentIndex, setCurrentIndex] = useState(0); // Current exercise index
  const [userAnswer, setUserAnswer] = useState(""); // User's current answer
  const [modalVisible, setModalVisible] = useState(false); // Feedback modal visibility
  const [isCorrect, setIsCorrect] = useState(null); // Answer correctness status
  const [correctAnswer, setCorrectAnswer] = useState(""); // Correct answer storage
  const [isAnswerSelected, setIsAnswerSelected] = useState(false); // Answer selection state
  const [mistakes, setMistakes] = useState([]); // Track incorrect exercises
  const [mistakeExplanation, setMistakeExplanation] = useState(""); // AI-generated explanation

  // Exercise management
  const [originalExercises, setOriginalExercises] = useState([]); // Track original list
  const [currentExercises, setCurrentExercises] = useState([]); // Current displayed exercises

  // Access global progression stats
  const { xp, hearts, updateStats } = useContext(AppContext);

  // Load the exercises
  useEffect(() => {
    const loadExercises = async () => {
      const data = await fetchExercises(unitId, lessonId); // Fetch exercises for the specific unit and lesson
      //console.log(data);
      setExercises(data);
      setOriginalExercises(data);
      setCurrentExercises(data);
    };
    loadExercises();
  }, [unitId, lessonId]);

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Get current exercise
  const currentExercise = currentExercises[currentIndex];

  // Handle input change for text-based answers
  const handleInputChange = (text) => {
    setUserAnswer(text);
    setIsAnswerSelected(text.trim().length > 0);
  };

  function parseFraction(str) {
    if (typeof str !== "string") return NaN;
    const [num, den] = str.split("/").map(Number);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
    return NaN;
  }

  // Validate user answer against correct solution
  const handleCheckAnswer = (selectedAnswer = null) => {
    if (!isAnswerSelected) return;

    // const correct = currentExercise.correct_answer;
    // let isAnswerCorrect = false;

    // if (currentExercise.answer_type === "text") {
    //   isAnswerCorrect = parseFloat(userAnswer.trim()) === parseFloat(correct);
    // } else if (currentExercise.answer_type === "multiple_choice") {
    //   isAnswerCorrect =
    //     String(selectedAnswer).trim() === String(correct).trim();
    // }

    const correct = String(currentExercise.correct_answer).trim();
    const answer = String(userAnswer).trim();
    let isAnswerCorrect = false;

    if (currentExercise.answer_type === "text") {
      // Case 1: Infinity answers
      if (
        correct === "inf" ||
        correct === "-inf" ||
        correct === "-Inf" ||
        correct === "Inf"
      ) {
        isAnswerCorrect = answer.toLowerCase() === correct.toLowerCase();
      }
      // Case 2: Fraction answers
      else if (answer.includes("/") && correct.includes("/")) {
        const parsedUser = parseFraction(answer);
        const parsedCorrect = parseFraction(correct);
        if (!isNaN(parsedUser) && !isNaN(parsedCorrect)) {
          isAnswerCorrect = parsedUser === parsedCorrect;
        } else {
          isAnswerCorrect = answer === correct; // fallback to string
        }
      }
      // Case 3: Number answers
      else {
        isAnswerCorrect = parseFloat(userAnswer.trim()) === parseFloat(correct);
      }
    } else if (currentExercise.answer_type === "multiple_choice") {
      isAnswerCorrect =
        String(selectedAnswer).trim() === String(correct).trim();
    }

    // Set answer state
    setIsCorrect(isAnswerCorrect);
    setCorrectAnswer(correct);

    // Update progression stats - XP calculation using originalIndex
    if (isAnswerCorrect) {
      const isRetry = mistakes.includes(currentExercise.originalIndex);
      updateStats({
        xp: xp + (isRetry ? 5 : 10),
      });

      setMistakes((prev) =>
        prev.filter((index) => index !== currentExercise.originalIndex)
      );
    } else {
      updateStats({
        hearts: Math.max(hearts - 1, 0),
      });

      setMistakes((prev) => [
        ...new Set([...prev, currentExercise.originalIndex]),
      ]);
    }

    // Show feedback modal
    setModalVisible(true);
  };

  // Generate AI explanation for incorrect answers
  const handleExplainMistake = async () => {
    console.log({
      question: currentExercise.question,
      expression: currentExercise.expression,
      userAnswer,
      correctAnswer: currentExercise.correct_answer,
      xValue: currentExercise.x_value,
    });

    const explanation = await explainMistake(
      currentExercise.question,
      currentExercise.expression,
      userAnswer,
      currentExercise.correct_answer,
      currentExercise.x_value
    );

    setMistakeExplanation(explanation);
  };

  // Proceed to next exercise or lesson completion
  const handleNextExercise = () => {
    setModalVisible(false);
    setMistakeExplanation("");

    // Move to next exercise if available
    if (currentIndex < currentExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Retry incorrect exercises if any
      if (mistakes.length > 0) {
        // Get original exercises that were incorrect
        const retryExercises = originalExercises.filter((ex) =>
          mistakes.includes(ex.originalIndex)
        );
        setCurrentExercises(retryExercises);
        setCurrentIndex(0);
      } else {
        router.push({
          pathname: `exercises/lessonComplete?unitId=${unitId}&lessonId=${lessonId}&xp=${xp}`,
          params: { unitId: unitId, lessonId: lessonId, xp: xp },
        });
      }
    }
    setUserAnswer("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </Pressable>

        <Text style={styles.xpText}>XP: {xp}</Text>
        <View style={styles.heartContainer}>
          <FontAwesome name="heart-o" size={20} color="black" />
          <Text style={styles.heartText}>{hearts}</Text>
        </View>
      </View>

      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseProgress}>
          Exercise {currentIndex + 1} / {exercises.length}
        </Text>

        <Text style={styles.question}>{currentExercise.question}</Text>

        <View style={styles.question}>
          <MathJaxSvg fontSize={23}>
            {`\\[
              \\lim_{{x \\to ${currentExercise.x_value}}} ${currentExercise.expression} = ?
              \\]`}
          </MathJaxSvg>
        </View>

        {currentExercise.answer_type === "text" ? (
          // For "find_limit" type questions, show a TextInput for entering answers
          <TextInput
            style={styles.input}
            keyboardType="default"
            placeholder="Enter your answer"
            value={userAnswer}
            onChangeText={handleInputChange}
          />
        ) : currentExercise.answer_type === "multiple_choice" ? (
          // For "multiple_choice" type questions, show the choices as options
          <View style={styles.optionsContainer}>
            {Array.isArray(currentExercise.choices) &&
            currentExercise.choices.length > 0 ? (
              currentExercise.choices.map((option, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.optionButton,
                    userAnswer === option && { backgroundColor: "#5cb85c" },
                  ]}
                  onPress={() => {
                    setUserAnswer(option);
                    setIsAnswerSelected(true);
                    handleCheckAnswer(option);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </Pressable>
              ))
            ) : (
              <Text>No choices available</Text>
            )}
          </View>
        ) : (
          <Text>No choices available</Text> // Fallback if no valid answer type is found
        )}
        <Pressable
          style={[
            styles.checkButton,
            {
              backgroundColor:
                isAnswerSelected && hearts > 0 ? "green" : "gray",
            },
          ]}
          onPress={handleCheckAnswer}
          disabled={!isAnswerSelected || hearts === 0}
        >
          <Text style={styles.checkButtonText}>CHECK</Text>
        </Pressable>
      </View>

      {/* Feedback Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {isCorrect ? " Correct!" : " Incorrect!"}
            </Text>

            {!isCorrect && (
              <>
                <Text style={styles.correctAnswer}>
                  Correct Answer: {correctAnswer}
                </Text>

                {mistakeExplanation ? (
                  <>
                    <Text style={styles.explanationText}>
                      {mistakeExplanation}
                    </Text>
                    {/* Always allow asking again */}
                    <Pressable
                      style={styles.explainButton}
                      onPress={handleExplainMistake}
                    >
                      <Text style={styles.explainButtonText}>
                        Explain Again
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={styles.explainButton}
                    onPress={handleExplainMistake}
                  >
                    <Text style={styles.explainButtonText}>
                      Explain My Mistake
                    </Text>
                  </Pressable>
                )}
              </>
            )}

            <Pressable style={styles.nextButton} onPress={handleNextExercise}>
              <Text style={styles.nextButtonText}>Next Exercise</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Apply styles to the elements
function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    backButton: {
      padding: 5,
    },

    xpText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    heartContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    heartText: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 5,
    },

    exerciseContainer: {
      alignItems: "center",
      justifyContent: "flex-start",
      flex: 1,
    },

    exerciseProgress: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "left",
    },

    question: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 20,
    },

    input: {
      width: "80%",
      height: 50,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      marginBottom: 20,
    },

    optionsContainer: {
      width: "80%",
      alignSelf: "center",
    },

    optionButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: "lightblue",
      marginVertical: 5,
    },

    optionText: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },

    checkButton: {
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
      width: "80%",
      alignItems: "center",
    },

    checkButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },

    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      width: "100%",
    },

    modalText: {
      fontSize: 20,
      fontWeight: "bold",
    },

    correctAnswer: {
      fontSize: 18,
      marginTop: 10,
    },

    explanationText: {
      fontSize: 16,
      marginTop: 10,
      fontStyle: "italic",
    },

    explainButton: {
      backgroundColor: "orange",
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
    },

    explainButtonText: {
      color: "black",
      fontSize: 16,
    },

    nextButton: {
      backgroundColor: "green",
      padding: 10,
      borderRadius: 10,
      marginTop: 10,
    },

    nextButtonText: {
      color: "white",
      fontSize: 16,
    },
  });
}
