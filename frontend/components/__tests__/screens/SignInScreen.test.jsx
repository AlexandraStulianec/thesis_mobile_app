import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignInScreen from "@/app/(auth)/signin";
import { AppContext } from "@/app/context/AppContext";
import { useRouter } from "expo-router";

// Mock the signIn function
jest.mock("@/app/api/database_handler", () => ({
  signIn: jest.fn(),
}));

// Mock the router
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("SignInScreen", () => {
  const mockPush = jest.fn();
  const mockSignIn = require("@/app/api/database_handler").signIn;

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });
  });

  const renderWithContext = (valueOverrides = {}) => {
    const defaultSignIn = async (name, email, password) => {
      return await mockSignIn(name, email, password);
    };

    return render(
      <AppContext.Provider value={{ signin: defaultSignIn, ...valueOverrides }}>
        <SignInScreen />
      </AppContext.Provider>
    );
  };

  it("creates account successfully and navigates to login", async () => {
    mockSignIn.mockResolvedValue({
      message: "Account created successfully",
    });

    const { getByPlaceholderText, getByText } = renderWithContext();

    fireEvent.changeText(getByPlaceholderText("Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("CREATE ACCOUNT"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "password123"
      );
      expect(mockPush).toHaveBeenCalledWith("/(auth)/login");
    });
  });

  it("shows error on account creation failure", async () => {
    mockSignIn.mockResolvedValue({
      error: "Account creation failed",
    });

    const { getByPlaceholderText, getByText, findByText } = renderWithContext();

    fireEvent.changeText(getByPlaceholderText("Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.press(getByText("CREATE ACCOUNT"));

    const errorMessage = await findByText("Account creation failed");
    expect(errorMessage).toBeTruthy();
  });

  it("shows error when name, email, or password is missing", async () => {
    const { getByText, findByText } = renderWithContext();

    fireEvent.press(getByText("CREATE ACCOUNT"));

    const error = await findByText("All fields are required");
    expect(error).toBeTruthy();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("navigates to login screen when pressed", () => {
    const { getByText } = renderWithContext();

    fireEvent.press(getByText("LOG IN"));
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
