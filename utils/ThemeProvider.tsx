import React, { createContext, useContext } from "react";

// Create the theme provider for the top level
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Define your theme object
  const theme: Theme = {
    primary: "green",
    primarydark: "#5AAFA8",
    secondary: "#006D77",
    secondarylight: "#00838F",
    background: "#83C5BE",
    error: "#E29578",
    white: "#EDF6F9",
    black: "#000",
    gray: "darkgray",
    // Add more colors as needed
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Theme type
export interface Theme {
  primary: string;
  primarydark: string;
  secondary: string;
  secondarylight: string;
  background: string;
  error: string;
  white: string;
  black: string;
  gray: string;
  // Add more properties as needed
}

// Create the theme context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Create a custom hook to access the theme context
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);

  if (!theme) throw new Error("useTheme must be used within a ThemeProvider");

  return theme;
};

export default ThemeProvider;
