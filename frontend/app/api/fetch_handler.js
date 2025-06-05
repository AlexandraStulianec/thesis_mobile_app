import axios from "axios";

//const API_URL = "http://127.0.0.1:5000"; //web
//const API_URL = `http://10.0.2.2:5000`; //emulator
//const API_URL = `http://192.168.1.196:5000`; //acasa
const API_URL = `http://192.168.82.99:5000`; //hospot meu

/**
 * Fetches theory content for a specific unit
 *
 * @param {number} unitId - ID of the unit to retrieve
 * @returns {Object|null} Unit theory content or null on error
 */
export const fetchData = async (unitId) => {
  try {
    // Request specific content
    const response = await axios.post(`${API_URL}/get_units`, {
      unit_id: unitId,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching unit theory:", error.message);

    if (error.response) {
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error in request:", error.message);
    }

    return null;
  }
};

/**
 * Fetches exercises for a unit/lesson
 *
 * @param {number} unitId - ID of the unit
 * @param {number|null} lessonId - Optional lesson ID
 * @returns {Array|Object} Exercise list or lessons overview
 */
export const fetchExercises = async (unitId, lessonId = null) => {
  try {
    const requestBody = { unit_id: unitId };

    // If lessonId is provided, add it to the request body
    if (lessonId !== null) {
      requestBody.lesson_id = lessonId;
    }

    // Fetch exercise data
    const response = await axios.post(`${API_URL}/exercises`, requestBody);

    // Add originalIndex to each exercise
    return (lessonId ? response.data.exercises : response.data.lessons).map(
      (ex, index) => ({ ...ex, originalIndex: index })
    );
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return { error: error.message };
  }
};
