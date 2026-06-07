import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext("light");


export const Context = () => {
    const [theme, setTheme] = useState(useContext(ThemeContext));
  return {theme, setTheme}
}

