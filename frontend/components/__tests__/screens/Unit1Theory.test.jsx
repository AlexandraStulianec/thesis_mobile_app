import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Unit1Theory from "@/app/(tabs)/home/units/unit1_theory";
import { fetchData } from "@/app/api/fetch_handler";
import { useRouter } from "expo-router";

// Mock the necessary imports
jest.mock("@/app/api/fetch_handler", () => ({
  fetchData: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Unit1Theory Screen", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  it("renders static content", () => {
    render(<Unit1Theory />);

    // Check static text elements
    expect(screen.getByText("UNIT 1")).toBeTruthy();
    expect(
      screen.getByText("Basics of and Operations with Limits")
    ).toBeTruthy();
    expect(screen.getByText("EX")).toBeTruthy();
  });

  it("fetches and renders theory data", async () => {
    // Mock the fetchData function to return sample data
    const mockData = [
      {
        title:
          "We use limits to describe how a function behaves as its input approaches a certain value.",
        equation: "\\[\\lim_{{x \\to a}} f(x) = L\\]",
        example: "\\[ \\lim_{{x \\to 2}} (3x + 1) = 6 + 1 = 7\\]",
      },
    ];

    fetchData.mockResolvedValue(mockData);

    render(<Unit1Theory />);

    // Wait for the FlatList to render the fetched data
    await waitFor(() =>
      expect(
        screen.getByText(
          "We use limits to describe how a function behaves as its input approaches a certain value."
        )
      ).toBeTruthy()
    );
    //expect(screen.getByText("Continuity")).toBeTruthy();
  });

  it("navigates to exercise screen when EX button is pressed", () => {
    render(<Unit1Theory />);

    const exButton = screen.getByText("EX");
    fireEvent.press(exButton);

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "home/units/unit1",
      params: { unitId: 1 },
    });
  });
});
