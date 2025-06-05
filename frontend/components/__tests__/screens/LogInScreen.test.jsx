import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LogInScreen from "@/app/(auth)/login";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "expo-router";

// Mock the logIn function
jest.mock("@/app/api/database_handler", () => ({
  logIn: jest.fn(),
}));

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("LogInScreen", () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  const renderWithContext = (loginOverride = mockLogin) =>
    render(
      <AppContext.Provider value={{ login: loginOverride }}>
        <LogInScreen />
      </AppContext.Provider>
    );

  it("logs in successfully and navigates to home", async () => {
    mockLogin.mockImplementation(async (email, password) => {
      return {
        token: "mocked_token",
        user: { email },
      };
    });

    const { getByPlaceholderText, getByText } = renderWithContext();

    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("LOG IN"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      expect(mockPush).toHaveBeenCalledWith("/(tabs)/home");
    });
  });

  it("shows error on invalid credentials", async () => {
    mockLogin.mockImplementation(async () => ({
      error: "Invalid credentials",
    }));

    const { getByPlaceholderText, getByText, findByText } = renderWithContext();

    fireEvent.changeText(getByPlaceholderText("Email"), "wrong@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "wrongpass");
    fireEvent.press(getByText("LOG IN"));

    const errorMessage = await findByText("Invalid credentials");
    expect(errorMessage).toBeTruthy();
  });

  it("shows error when fields are empty", async () => {
    const { getByText, findByText } = renderWithContext();

    fireEvent.press(getByText("LOG IN"));

    const error = await findByText("Email and password are required");
    expect(error).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("navigates to sign up screen on SIGN UP press", () => {
    const { getByText } = renderWithContext();

    fireEvent.press(getByText("SIGN UP"));
    expect(mockPush).toHaveBeenCalledWith("/signin");
  });
});
