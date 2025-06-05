import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Unit1Exercises from "@/app/(tabs)/home/units/unit1"; // Adjust path based on your structure
import { AppContext } from "@/app/context/AppContext";
import { fetchExercises } from "@/app/api/fetch_handler";

jest.mock("@/app/api/fetch_handler", () => ({
  fetchExercises: jest.fn(),
}));

// Mocking useRouter here so that it's available globally for all tests
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocalSearchParams: () => ({ unitId: "1" }),
}));

describe("Unit1Exercises screen", () => {
  const mockLessons = [
    { lesson_id: 1, title: "Lesson 1" },
    { lesson_id: 2, title: "Lesson 2" },
  ];

  const completed_lessons = ["lesson_1_1"];

  const renderWithContext = () =>
    render(
      <AppContext.Provider value={{ completed_lessons }}>
        <Unit1Exercises />
      </AppContext.Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    fetchExercises.mockResolvedValue(mockLessons);
  });

  it("displays loading state initially", async () => {
    fetchExercises.mockResolvedValueOnce([]); // Empty to simulate loading
    const { getByText } = renderWithContext();

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders list of lessons", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      expect(getByText("Lesson 1")).toBeTruthy();
      expect(getByText("Lesson 2")).toBeTruthy();
    });
  });

  it("marks lesson 1 as unlocked and lesson 2 as unlocked (based on context)", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      const lesson1 = getByText("Lesson 1");
      const lesson2 = getByText("Lesson 2");

      expect(lesson1.props.style).not.toContainEqual({ color: "gray" });
      expect(lesson2.props.style).not.toContainEqual({ color: "gray" }); // since lesson 1 is completed
    });
  });

  it("disables lesson 2 if previous lesson is not completed", async () => {
    const incompleteContext = { completed_lessons: [] };
    const { getByText } = render(
      <AppContext.Provider value={incompleteContext}>
        <Unit1Exercises />
      </AppContext.Provider>
    );

    await waitFor(() => {
      expect(getByText("Lesson 2").props.style).toContainEqual({
        color: "gray",
      });
    });
  });

  it("calls router.push when unlocked lesson is pressed", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      const lesson1 = getByText("Lesson 1");
      fireEvent.press(lesson1);
    });

    expect(mockPush).toHaveBeenCalled();
  });
});
