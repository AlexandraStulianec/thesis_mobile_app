import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  logIn,
  signIn,
  fetchUserStats,
  updateUserStats,
  logOut,
} from "@/app/api/database_handler";

// Create application context for global state management
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initial application state
  const [state, setState] = useState({
    user: null,
    name: null,
    xp: 0,
    hearts: 5,
    current_lesson: 1,
    current_unit: 1,
    completed_lessons: [],
    isLoading: true,
  });

  // Initialize application state on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing authentication token
        const token = await AsyncStorage.getItem("token");

        // No token = no authenticated user
        if (!token) {
          setState((prev) => ({ ...prev, isLoading: false })); // No user, set loading false
          return;
        }

        // Check for cached user data
        const storedUser = await AsyncStorage.getItem("user");
        const storedStats = await AsyncStorage.getItem("stats");

        // Use cached data if available
        if (storedUser && storedStats) {
          setState((prev) => ({
            ...prev,
            user: JSON.parse(storedUser),
            ...JSON.parse(storedStats),
            isLoading: false,
          }));
        } else {
          // Fetch fresh stats if not found
          const freshStats = await fetchUserStats();
          await AsyncStorage.setItem("stats", JSON.stringify(freshStats));

          setState((prev) => ({
            ...prev,
            ...freshStats,
            user: storedUser ? JSON.parse(storedUser) : null,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Stats load error:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeApp();
  }, []);

  /**
   * Updates user statistics both locally and on the server
   *
   * @param {Object} updatedFields - Fields to update (xp, hearts, etc.)
   */
  const updateStats = async (updatedFields) => {
    try {
      // Create an object with only the fields that need updating
      const newStats = {
        name: updatedFields.name ?? state.name,
        xp: updatedFields.xp ?? state.xp,
        hearts: updatedFields.hearts ?? state.hearts,
        current_lesson: updatedFields.current_lesson ?? state.current_lesson,
        current_unit: updatedFields.current_unit ?? state.current_unit,
        completed_lessons: Array.isArray(updatedFields.completed_lessons)
          ? [...state.completed_lessons, ...updatedFields.completed_lessons] // Append new lessons
          : state.completed_lessons,
      };

      console.log(newStats.completed_lessons);

      // Send updated stats to the backend API
      await updateUserStats({
        name: newStats.name,
        xp: newStats.xp,
        hearts: newStats.hearts,
        current_lesson: newStats.current_lesson,
        current_unit: newStats.current_unit,
        completed_lessons: newStats.completed_lessons,
      });

      // Fetch latest stats from backend to ensure consistency
      const freshStats = await fetchUserStats();

      // Update local state with the latest stats
      setState((prev) => ({
        ...prev,
        ...freshStats,
      }));

      // Store in AsyncStorage for persistence
      await AsyncStorage.setItem("stats", JSON.stringify(freshStats));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  /**
   * Handles user login flow
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} Login result (success/error)
   */
  const login = async (email, password) => {
    const response = await logIn(email, password);

    // Check if the login failed
    if (response.error) {
      return { error: response.error };
    }

    try {
      // Store token and user info
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));

      const freshStats = await fetchUserStats();
      await AsyncStorage.setItem("stats", JSON.stringify(freshStats));

      // Update application state
      setState((prev) => ({
        ...prev,
        user: response.user,
        ...freshStats,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { error: "Login storage failed" };
    }
  };

  /**
   * Handles new user registration
   *
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {boolean} Registration success status
   */
  const signin = async (name, email, password) => {
    try {
      const response = await signIn(name, email, password);

      await AsyncStorage.setItem("token", response.token);

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  /**
   * Handles user logout and state reset
   */
  const logout = async () => {
    try {
      await logOut(); // Call backend logout

      // Clear all stored data
      await AsyncStorage.clear();

      // Reset to initial state
      setState({
        user: null,
        xp: 0,
        hearts: 5,
        current_lesson: 1,
        current_unit: 1,
        completed_lessons: [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Provide context value to child components
  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        signin,
        logout,
        updateStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
