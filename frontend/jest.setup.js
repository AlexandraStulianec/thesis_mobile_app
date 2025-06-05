import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// jest.setup.js
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    MaterialIcons: ({ name, size, color }) =>
      React.createElement("Icon", { name, size, color }),
    FontAwesome: ({ name, size, color }) =>
      React.createElement("Icon", { name, size, color }),
    FontAwesome6: ({ name, size, color }) =>
      React.createElement("Icon", { name, size, color }),
    Ionicons: ({ name, size, color }) =>
      React.createElement("Icon", { name, size, color }),
  };
});
