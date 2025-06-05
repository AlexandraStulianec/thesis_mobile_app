import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProfileScreen from "@/app/(tabs)/profile/index";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "expo-router";

// Mock router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock Appearance for theme testing
// jest.mock("react-native", () => {
//   const RN = jest.requireActual("react-native");
//   return {
//     ...RN,
//     Appearance: {
//       getColorScheme: jest.fn(() => "light"), // or "dark"
//     },
//   };
// });

describe("ProfileScreen", () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
  });

  const mockContext = {
    name: "User",
    xp: 150,
    current_lesson: 5,
    current_unit: 2,
  };

  const renderComponent = () =>
    render(
      <AppContext.Provider value={mockContext}>
        <ProfileScreen />
      </AppContext.Provider>
    );

  it("renders user name, XP, current lesson and unit", () => {
    const { getByText } = renderComponent();

    expect(getByText("User")).toBeTruthy();
    expect(getByText("150")).toBeTruthy();
    expect(getByText("5")).toBeTruthy();
    expect(getByText("2")).toBeTruthy();
  });

  it("navigates to privacy screen when edit icon is pressed", () => {
    const { getByTestId } = renderComponent();

    const editButton = getByTestId("editButton");
    fireEvent.press(editButton);
    expect(mockRouterPush).toHaveBeenCalledWith("/profile/privacy");
  });

  it("navigates to privacy screen from 'Privacy' link", () => {
    const { getByText } = renderComponent();

    const privacyLink = getByText("Privacy");
    fireEvent.press(privacyLink);
    expect(mockRouterPush).toHaveBeenCalledWith("/profile/privacy");
  });

  it("navigates to logout screen when 'Logout' is pressed", () => {
    const { getByText } = renderComponent();

    const logoutLink = getByText("Logout");
    fireEvent.press(logoutLink);
    expect(mockRouterPush).toHaveBeenCalledWith("/profile/logout");
  });
});
