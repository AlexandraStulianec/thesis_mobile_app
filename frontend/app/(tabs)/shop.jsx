import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
  Appearance,
} from "react-native";
import React from "react";
import shop from "@/assets/images/shop.png";
import { useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Header from "@/components/Header";
import { AppContext } from "@/app/context/AppContext";

export default function ShopScreen() {
  //Theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);

  // Access user stats and update function from context
  const { xp, hearts, updateStats } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <Header></Header>

      <View style={styles.shopContainer}>
        <Image source={shop} style={styles.image}></Image>

        <View style={styles.contentContainer}>
          <Text style={styles.menuItemTitle}>SHOP</Text>
          <Text style={styles.menuItemText}>BUY EVERYTHING THAT YOU NEED!</Text>
        </View>
      </View>

      <View style={styles.header2}>
        <FontAwesome name="heart-o" size={20} color="black" />
        <Text style={styles.xpText}>REFILL HEARTS</Text>
        {/* Button to buy 1 heart for 10 XP (only enabled if user has enough XP and less than 5 hearts) */}
        <Pressable
          style={[
            styles.button,
            hearts < 5 && xp >= 10
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => {
            if (xp >= 10 && hearts < 5) {
              updateStats({
                xp: xp - 10,
                hearts: hearts + 1,
              });
            }
          }}
        >
          <Text style={styles.xpCost}>10 XP</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

//Apply style to the elements
function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },

    header2: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 10,
    },

    xpText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },

    shopContainer: {
      alignItems: "center",
      justifyContent: "center,",
    },

    image: {
      width: 150,
      height: 150,
      resizeMode: "contain",
      marginVertical: 20,
    },

    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
    },

    menuItemTitle: {
      fontSize: 25,
      fontWeight: "bold",
      textAlign: "center",
      paddingBottom: 10,
    },

    menuItemText: {
      fontSize: 15,
      color: theme.text,
      textAlign: "center",
      fontWeight: "bold",
    },

    button: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginTop: 10,
      justifyContent: "center",
      width: 90,
    },

    buttonActive: {
      backgroundColor: "rgba(0,0,0,0)",
    },

    buttonInactive: {
      backgroundColor: "rgba(0,0,0,0.3)",
    },

    buttonText: {
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },

    xpCost: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
  });
}
