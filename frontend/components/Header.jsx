import { View, Text, StyleSheet, Appearance } from "react-native";
import { Colors } from "@/constants/Colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { AppContext } from "../app/context/AppContext";
import { useContext } from "react";

// Create the Header in the application with the values from the Context
export default function Header() {
  // Theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);

  // Retrieve the global data from the context
  const { xp, hearts } = useContext(AppContext);

  // Display the data
  return (
    <View style={styles.header}>
      <FontAwesome6 name="infinity" size={25} color="black" />
      <Text style={styles.xpText}>{xp} XP</Text>
      <View style={styles.heartContainer}>
        <FontAwesome name="heart-o" size={20} color="black" />
        <Text style={styles.heartText}>{hearts}</Text>
      </View>
    </View>
  );
}

//Apply styles to it
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

    xpText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    heartText: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 5,
    },

    heartContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
}
