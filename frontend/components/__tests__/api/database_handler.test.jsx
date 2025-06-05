import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  signIn,
  logIn,
  logOut,
  fetchUserStats,
  updateUserStats,
} from "@/app/api/database_handler";

jest.mock("axios");

describe("database_handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear(); // clear mock storage before each test
  });

  it("should sign in a user and store token", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "test-token" } });

    const result = await signIn("TestUser", "test@example.com", "password123");

    expect(result).toEqual({ token: "test-token" });
  });

  it("should log in a user and store token", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "login-token" } });

    const result = await logIn("test@example.com", "password123");

    expect(result).toEqual({ token: "login-token" });
  });

  it("should log out the user", async () => {
    // First mock a token in AsyncStorage
    await AsyncStorage.setItem("token", "test-token");

    axios.post.mockResolvedValueOnce({ data: { message: "Logged out" } });

    const result = await logOut();

    expect(result).toEqual({ message: "Logged out" });
  });

  it("should fetch user stats", async () => {
    await AsyncStorage.setItem("token", "test-token");
    const mockData = {
      name: "John Doe",
      xp: 100,
      hearts: 3,
      current_lesson: 2,
      current_unit: 1,
      completed_lessons: [1, 2],
    };

    axios.get.mockResolvedValueOnce({ status: 200, data: mockData });

    const result = await fetchUserStats();

    expect(result).toEqual(mockData);
  });

  it("should update user stats", async () => {
    await AsyncStorage.setItem("token", "test-token");

    axios.post.mockResolvedValueOnce({ status: 200, data: { success: true } });

    const updatedFields = { xp: 150, hearts: 5 };

    const result = await updateUserStats(updatedFields);

    expect(result).toEqual({ success: true });
  });
});
