import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MenuScreen from "@/app/(tabs)/home/index";
import { useRouter } from "expo-router";
import { AppContext } from "@/app/context/AppContext";
import * as fetchHandler from "@/app/api/fetch_handler";

// Mock navigation
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock fetchData
jest.mock("@/app/api/fetch_handler", () => ({
  fetchData: jest.fn(),
}));

describe("MenuScreen", () => {
  const mockPush = jest.fn();

  const mockMenuData = [
    {
      id: 1,
      title: "UNIT 1",
      description: "Basics of and Operations with Limits",
    },
    {
      id: 2,
      title: "UNIT 2",
      description: "Elementary Limit Functions I",
    },
    {
      id: 3,
      title: "UNIT 3",
      description: "Elementary Limit Functions II",
    },
  ];

  const contextValue = { name: "Alex" };

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
    fetchHandler.fetchData.mockResolvedValue(mockMenuData);
  });

  const renderWithContext = () =>
    render(
      <AppContext.Provider value={contextValue}>
        <MenuScreen />
      </AppContext.Provider>
    );

  it("renders static texts and header", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      expect(getByText("Hello, Alex!")).toBeTruthy();
      expect(getByText("WELCOME TO LEARNING LIMITS EFFICIENTLY!")).toBeTruthy();
      expect(getByText("LET'S START")).toBeTruthy();
    });
  });

  it("renders menu items after fetch", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      expect(getByText("UNIT 1")).toBeTruthy();
      expect(getByText("Basics of and Operations with Limits")).toBeTruthy();
      expect(getByText("UNIT 2")).toBeTruthy();
      expect(getByText("Elementary Limit Functions I")).toBeTruthy();
      expect(getByText("UNIT 3")).toBeTruthy();
      expect(getByText("Elementary Limit Functions II")).toBeTruthy();
    });
  });

  it("navigates to unit screen when a menu item is pressed", async () => {
    const { getByText } = renderWithContext();

    await waitFor(() => {
      fireEvent.press(getByText("UNIT 1"));
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "home/units/unit1",
      params: { unitId: 1 },
    });
  });

  it("shows fallback when there are no menu items", async () => {
    fetchHandler.fetchData.mockResolvedValueOnce([]);
    const { getByText } = renderWithContext();

    await waitFor(() => {
      expect(getByText("No Items")).toBeTruthy();
    });
  });
});
