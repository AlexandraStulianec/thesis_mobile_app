import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PrivacyScreen from "@/app/(tabs)/profile/privacy"; // Adjust path as needed
import { AppContext } from "@/app/context/AppContext";

// Mock Appearance
// jest.mock("react-native", () => {
//   const RN = jest.requireActual("react-native");
//   return {
//     ...RN,
//     Appearance: {
//       getColorScheme: jest.fn(() => "light"),
//     },
//   };
// });

describe("PrivacyScreen", () => {
  const mockUpdateStats = jest.fn();

  const mockContext = {
    name: "TestUser",
    updateStats: mockUpdateStats,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <AppContext.Provider value={mockContext}>
        <PrivacyScreen />
      </AppContext.Provider>
    );

  it("renders user's current name and profile image", () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText("TestUser")).toBeTruthy();
    expect(getByText("My Profile")).toBeTruthy();
    expect(getByTestId("profileImage")).toBeTruthy();
  });

  it("renders input and save button", () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText("Enter new name")).toBeTruthy();
    expect(getByText("Save")).toBeTruthy();
  });

  it("updates name when Save is pressed", async () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    const input = getByPlaceholderText("Enter new name");
    const saveButton = getByText("Save");

    fireEvent.changeText(input, "NewName");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockUpdateStats).toHaveBeenCalledWith({ name: "NewName" });
    });
  });

  it("does not call updateStats when input is empty", async () => {
    const { getByText } = renderComponent();

    const saveButton = getByText("Save");
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockUpdateStats).not.toHaveBeenCalled();
    });
  });
});
