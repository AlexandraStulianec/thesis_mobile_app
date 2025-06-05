import React from "react";
import { render } from "@testing-library/react-native";
import Header from "@/components/Header";
import { AppContext } from "@/app/context/AppContext";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

describe("Header component", () => {
  const renderHeader = (contextValue) =>
    render(
      <AppContext.Provider value={contextValue}>
        <Header />
      </AppContext.Provider>
    );

  it("renders XP and heart count from context", () => {
    const context = { xp: 120, hearts: 3, isLoading: false };
    const { getByText } = renderHeader(context);

    expect(getByText("120 XP")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });

  it("renders FontAwesome icons correctly", () => {
    const context = { xp: 50, hearts: 2, isLoading: false };
    const { UNSAFE_getAllByType } = renderHeader(context);

    const icons = UNSAFE_getAllByType(FontAwesome);
    const icons6 = UNSAFE_getAllByType(FontAwesome6);

    expect(icons.length).toBeGreaterThan(0); // heart icon
    expect(icons6.length).toBeGreaterThan(0); // infinity icon
  });
});
