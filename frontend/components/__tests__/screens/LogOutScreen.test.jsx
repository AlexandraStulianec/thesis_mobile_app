import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LogOutScreen from "@/app/(tabs)/profile/logout";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "expo-router";

// Mock useRouter
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("LogOutScreen", () => {
  const mockRouterPush = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    jest.clearAllMocks();
  });

  const renderComponent = (logoutMock) =>
    render(
      <AppContext.Provider value={{ logout: logoutMock }}>
        <LogOutScreen />
      </AppContext.Provider>
    );

  it("renders logout and cancel buttons", () => {
    const { getByText } = renderComponent(mockLogout);

    expect(getByText("Logout Account?")).toBeTruthy();
    expect(getByText("Logout")).toBeTruthy();
    expect(getByText("Cancel")).toBeTruthy();
  });

  it("calls logout and navigates to /auth on successful logout", async () => {
    mockLogout.mockResolvedValueOnce({ error: null });
    const { getByText } = renderComponent(mockLogout);

    const logoutButton = getByText("Logout");
    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith("/(auth)");
    });
  });

  it("navigates to /profile on cancel", () => {
    const { getByText } = renderComponent(mockLogout);

    const cancelButton = getByText("Cancel");
    fireEvent.press(cancelButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/profile");
  });
});
