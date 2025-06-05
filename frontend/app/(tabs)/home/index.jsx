import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Appearance,
  Platform,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { fetchData } from "../../api/fetch_handler";
import { AppContext } from "@/app/context/AppContext";

export default function MenuScreen() {
  // Navigation and theme setup
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  const router = useRouter();

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;
  const separatorComponent = <View style={styles.separator} />;

  const [menuData, setMenuData] = useState(null);
  const { name } = useContext(AppContext); // Get user's name from context

  // Load unit data from backend
  useEffect(() => {
    const loadMenu = async () => {
      const data = await fetchData("menu_items");
      //console.log(data);
      setMenuData(data);
    };

    loadMenu();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header></Header>

      <View style={styles.contentContainer}>
        <Text style={styles.menuItemTitle}>Hello, {name}!</Text>
        <Text style={styles.menuItemText}>
          WELCOME TO LEARNING LIMITS EFFICIENTLY!
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.text}>LET'S START</Text>
      </View>

      {/* Unit List */}
      <Container>
        <FlatList
          data={menuData}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={separatorComponent}
          ListEmptyComponent={<Text> No Items</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() =>
                router.push({
                  pathname: `home/units/unit` + item.id,
                  params: { unitId: item.id }, // Pass unitId as a parameter
                })
              }
            >
              <View style={styles.menuTextRow}>
                <Text style={[styles.menuItemTitle, styles.menuItemText]}>
                  {item.title}
                </Text>
                <Text style={styles.menuItemText}>{item.description}</Text>
              </View>
            </Pressable>
          )}
        />
      </Container>
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
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      //backgroundColor: theme.background,
    },

    separator: {
      height: 1,
      backgroundColor: colorScheme === "dark" ? "papayawhip" : "#000",
      width: "50%",
      maxWidth: 300,
      marginHorizontal: "auto",
      marginBottom: 10,
    },

    row: {
      flexDirection: "row",
      width: "100%",
      maxWidth: 600,
      height: 100,
      marginBottom: 10,
      borderStyle: "solid",
      borderColor: colorScheme === "dark" ? "papayawhip" : "#000",
      borderWidth: 1,
      borderRadius: 20,
      overflow: "hidden",
      marginHorizontal: "auto",
    },
    menuTextRow: {
      width: "65%",
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 5,
      flexGrow: 1,
      backgroundColor: "pink",
    },
    menuItemTitle: {
      fontSize: 20,
      textDecorationLine: "underline",
      textAlign: "center",
      paddingBottom: 10,
      fontWeight: "bold",
    },
    menuItemText: {
      color: theme.text,
      textAlign: "center",
      fontWeight: "600",
    },

    text: {
      textAlign: "left",
      fontSize: 20,
      fontWeight: "bold",
    },
  });
}
