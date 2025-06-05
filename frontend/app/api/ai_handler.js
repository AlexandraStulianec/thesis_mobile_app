import axios from "axios";

/// API base URL configuration
//const API_URL = "http://127.0.0.1:5000"; //web
//const API_URL = `http://10.0.2.2:5000`; //emulator
//const API_URL = `http://192.168.1.196:5000`; //acasa
const API_URL = `http://192.168.82.99:5000`; //hospot meu

/**
 * Fetches AI-generated explanation for incorrect math answers
 *
 * @param {string} question - The original limit problem
 * @param {string} expression - Mathematical expression
 * @param {string} user_answer - Student's incorrect answer
 * @param {string} correct_answer - Correct answer
 * @param {number} x_value - X-value at which limit is computed
 * @returns {string} AI-generated explanation or fallback message
 */
export const explainMistake = async (
  question,
  expression,
  user_answer,
  correct_answer,
  x_value
) => {
  try {
    // const payload = {
    //   question: String(question),
    //   expression: String(expression),
    //   user_answer: String(user_answer),
    //   correct_answer: String(correct_answer),
    //   x_value: x_value,
    // };

    //console.log("Sending explainMistake payload:", payload);

    // Make POST request to explanation endpoint
    const response = await axios.post(`${API_URL}/explain_mistake`, {
      question,
      expression,
      user_answer,
      correct_answer,
      x_value,
    });
    return response.data.explanation;
  } catch (error) {
    console.error("Error fetching explanation:", error);
    return "Could not generate an explanation. Try again.";
  }
};
