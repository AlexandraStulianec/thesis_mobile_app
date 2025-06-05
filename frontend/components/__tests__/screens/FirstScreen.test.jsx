import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import FirstScreen from "@/app/(auth)/index";
import { useRouter } from "expo-router";

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("FirstScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it("renders title and subtitle correctly", () => {
    const { getByText } = render(<FirstScreen />);

    expect(getByText("MathTutor")).toBeTruthy();
    expect(getByText("The way")).toBeTruthy();
    expect(getByText("to learn")).toBeTruthy();
    expect(getByText("math!")).toBeTruthy();
  });

  it("renders both buttons", () => {
    const { getByText } = render(<FirstScreen />);

    expect(getByText("LET'S GO")).toBeTruthy();
    expect(getByText("LOG IN")).toBeTruthy();
  });

  it("navigates to /signin when LET'S GO is pressed", () => {
    const { getByText } = render(<FirstScreen />);

    fireEvent.press(getByText("LET'S GO"));
    expect(mockPush).toHaveBeenCalledWith("/signin");
  });

  it("navigates to /login when LOG IN is pressed", () => {
    const { getByText } = render(<FirstScreen />);

    fireEvent.press(getByText("LOG IN"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
