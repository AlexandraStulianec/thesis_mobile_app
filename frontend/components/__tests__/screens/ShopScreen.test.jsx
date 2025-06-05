import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ShopScreen from "@/app/(tabs)/shop";
import { AppContext } from "@/app/context/AppContext";

describe("ShopScreen", () => {
  it("enables heart refill when user has enough XP and hearts < 5", () => {
    const mockUpdateStats = jest.fn();

    const { getByText } = render(
      <AppContext.Provider
        value={{ xp: 20, hearts: 3, updateStats: mockUpdateStats }}
      >
        <ShopScreen />
      </AppContext.Provider>
    );

    const button = getByText("10 XP");
    fireEvent.press(button);

    expect(mockUpdateStats).toHaveBeenCalledWith({
      xp: 10,
      hearts: 4,
    });
  });

  it("does NOT refill hearts if user has less than 10 XP", () => {
    const mockUpdateStats = jest.fn();

    const { getByText } = render(
      <AppContext.Provider
        value={{ xp: 5, hearts: 3, updateStats: mockUpdateStats }}
      >
        <ShopScreen />
      </AppContext.Provider>
    );

    const button = getByText("10 XP");
    fireEvent.press(button);

    expect(mockUpdateStats).not.toHaveBeenCalled();
  });

  it("does NOT refill hearts if user already has 5 hearts", () => {
    const mockUpdateStats = jest.fn();

    const { getByText } = render(
      <AppContext.Provider
        value={{ xp: 15, hearts: 5, updateStats: mockUpdateStats }}
      >
        <ShopScreen />
      </AppContext.Provider>
    );

    const button = getByText("10 XP");
    fireEvent.press(button);

    expect(mockUpdateStats).not.toHaveBeenCalled();
  });
});
