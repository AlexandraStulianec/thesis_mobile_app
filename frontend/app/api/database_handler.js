import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//const API_URL = "http://127.0.0.1:5000"; //web
//const API_URL = `http://10.0.2.2:5000`; //emulator
//const API_URL = `http://192.168.1.196:5000`; //acasa
const API_URL = `http://192.168.82.99:5000`; //hospot meu

/**
 * Registers a new user
 *
 * @param {string} name - User's name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} Response data or error object
 */
export const signIn = async (name, email, password) => {
  try {
    // Send registration request
    const response = await axios.post(`${API_URL}/signin`, {
      name,
      email,
      password,
    });

    // Store token immediately after signup
    await AsyncStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Signup Error:", error.response?.data || error.message);
    return { error: error.response?.data?.error || "Signup failed" };
  }
};

/**
 * Authenticates existing user
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} Response data or error object
 */
export const logIn = async (email, password) => {
  try {
    // Send login request with credentials
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );

    // Store received token
    await AsyncStorage.setItem("token", response.data.token);
    //console.log(response.data.token);

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return { error: error.response?.data?.error || "Login failed" };
  }
};

/**
 * Terminates user session
 *
 * @returns {Object} Response data or error object
 */
export const logOut = async () => {
  try {
    // Retrieve token from storage
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Token is missing!");
    }

    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Clear local storage
    await AsyncStorage.multiRemove(["token", "user", "stats"]);

    return response.data;
  } catch (error) {
    console.error("Logout Error:", error.response?.data || error.message);
    return { error: error.response?.data?.error || "Logout failed" };
  }
};

/**
 * Retrieves user progress stats
 *
 * @returns {Object} User statistics object
 */
export const fetchUserStats = async () => {
  try {
    // Get stored authentication token
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Request user stats with token authorization
    const response = await axios.get(`${API_URL}/user_stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      name: response.data.name,
      xp: response.data.xp,
      hearts: response.data.hearts,
      current_lesson: response.data.current_lesson,
      current_unit: response.data.current_unit,
      completed_lessons: response.data.completed_lessons || [],
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

/**
 * Updates user progression data
 *
 * @param {Object} updates - Fields to update (name, xp, hearts, etc.)
 * @returns {Object} Response data
 */
export const updateUserStats = async (updates) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    // Valid updates
    const allowedFields = [
      "name",
      "xp",
      "hearts",
      "current_lesson",
      "current_unit",
      "completed_lessons",
    ];

    const validUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    if (Object.keys(validUpdates).length === 0) {
      throw new Error("No valid fields to update");
    }

    const response = await axios.post(`${API_URL}/user_update`, validUpdates, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};
