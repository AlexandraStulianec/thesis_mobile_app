import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Appearance,
  Pressable,
  SectionList,
  FlatList,
} from "react-native";
import { MathJaxSvg } from "react-native-mathjax-html-to-svg";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { fetchData } from "../../../api/fetch_handler";

export default function Unit3Theory() {
  // Navigation and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  // Load theory content for Unit 1 from the backend
  const [theoryData, setTheoryData] = useState(null);

  useEffect(() => {
    const loadTheory = async () => {
      const data = await fetchData("unit_3_functions");

      setTheoryData(data);
    };

    loadTheory();
  }, []);

  if (!theoryData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* Header */}
          <View>
            <Text style={styles.menuItemTitle}>UNIT 3</Text>
            <Text style={styles.menuItemText}>Remarkable Limits</Text>
          </View>

          {/* Shortcut to exercises */}
          <Pressable
            style={styles.headerButton}
            onPress={() =>
              router.push({
                pathname: `home/units/unit` + 3,
                params: { unitId: 3 }, // Pass unitId as a parameter
              })
            }
          >
            <Text style={styles.headerButtonText}>EX</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.menuItemTitle}>UNIT 3</Text>
          <Text style={styles.menuItemText}>Elementary Limit Functions II</Text>
        </View>

        <Pressable
          style={styles.headerButton}
          onPress={() => router.push("home/units/unit3")}
        >
          <Text style={styles.headerButtonText}>EX</Text>
        </Pressable>
      </View>

      {/* Render each theory item with title, equation, and example */}
      <FlatList
        data={theoryData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.theoryContainer}>
            <Text style={styles.theoryTitle}>{item.title}</Text>
            <View style={styles.equations}>
              <MathJaxSvg fontSize={16}>{item.equation}</MathJaxSvg>
            </View>
            <View style={styles.equations}>
              <MathJaxSvg fontSize={16}>{item.example}</MathJaxSvg>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

//Apply styles to the elemens
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

    theoryContainer: {
      padding: 5,
    },

    theoryText: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 5,
      marginTop: 3,
      textAlign: "justify",
    },

    theoryTitle: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 5,
      paddingBottom: 5,
      textAlign: "justify",
      fontWeight: "bold",
      padding: 10,
    },

    theoryText: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 5,
      marginTop: 3,
      textAlign: "justify",
    },

    equations: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 5,
    },
  });
}
