import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

type ThemeType = "light" | "dark";

type ThemeContextValue = {
    theme: ThemeType;
    toggleTheme: () => void;
    setTheme: (value: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<ThemeType>("light");

    useEffect(() => {
        const system = Appearance.getColorScheme();
        if (system === "light" || system == "dark") {
            setTheme(system);
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
};

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme må brukes inne i ThemeProvider");
    }
    return ctx;
}