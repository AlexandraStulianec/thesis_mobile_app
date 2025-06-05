import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import ExerciseScreen from "@/app/exercises/[unitId]/[lessonId]";
import { AppContext } from "@/app/context/AppContext";

// Mock router
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({ unitId: "1", lessonId: "1" }),
}));

// Mock fetch handler
jest.mock("@/app/api/fetch_handler", () => ({
  fetchExercises: jest.fn().mockResolvedValue([
    {
      question: "What's the limit?",
      correct_answer: "5",
      answer_type: "text",
      expression: "x + 2",
      x_value: "3",
      originalIndex: 0,
    },
  ]),
}));

// Mock AI handler
jest.mock("@/app/api/ai_handler", () => ({
  explainMistake: jest.fn().mockResolvedValue("It's because you added wrong"),
}));

const mockContext = {
  xp: 0,
  hearts: 3,
  updateStats: jest.fn(),
};

describe("ExerciseScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    const { getByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders an exercise after loading", async () => {
    const { findByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const question = await findByText("What's the limit?");
    expect(question).toBeTruthy();
  });

  it("checks correct answer and updates XP", async () => {
    const { findByPlaceholderText, getByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "5");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(mockContext.updateStats).toHaveBeenCalledWith({ xp: 10 });
    });
  });

  it("checks incorrect answer and reduces heart", async () => {
    const { findByPlaceholderText, getByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "99");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(mockContext.updateStats).toHaveBeenCalledWith({ hearts: 2 });
    });
  });

  it("shows explanation on incorrect answer", async () => {
    const { findByPlaceholderText, getByText, findByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "99");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    const explainButton = await findByText("Explain My Mistake");
    fireEvent.press(explainButton);

    const explanation = await findByText("It's because you added wrong");
    expect(explanation).toBeTruthy();
  });

  it("does not proceed if input is empty", async () => {
    const { findByText, getByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    await findByText("What's the limit?");
    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(mockContext.updateStats).not.toHaveBeenCalled();
    });
  });

  it("handles non-numeric input gracefully", async () => {
    const { findByPlaceholderText, getByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "abc");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(mockContext.updateStats).toHaveBeenCalledWith({ hearts: 2 });
    });
  });

  it("prevents interaction when hearts = 0", async () => {
    const zeroHeartsContext = { ...mockContext, hearts: 0 };

    const { findByPlaceholderText, getByText } = render(
      <AppContext.Provider value={zeroHeartsContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "5");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(zeroHeartsContext.updateStats).not.toHaveBeenCalled();
    });
  });

  it("completes an exercise correctly and progresses with XP reward", async () => {
    const { findByPlaceholderText, getByText, findByText } = render(
      <AppContext.Provider value={mockContext}>
        <ExerciseScreen />
      </AppContext.Provider>
    );

    const input = await findByPlaceholderText("Enter your answer");
    fireEvent.changeText(input, "5");

    await act(async () => {
      fireEvent.press(getByText("CHECK"));
    });

    await waitFor(() => {
      expect(mockContext.updateStats).toHaveBeenCalledWith({ xp: 10 });
    });

    const nextButton = await findByText("Next Exercise");
    expect(nextButton).toBeTruthy();
  });
});
