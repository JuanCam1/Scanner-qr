import {
	createContext,
	type FC,
	type ReactNode,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_ASYNC_STORAGE_KEY = "payment-theme";
type ThemeName = "dark" | "light";

interface PropsProvider {
	children: ReactNode;
}

export interface ThemeContextState {
	theme: ThemeName;
	toggleTheme: () => void;
	setTheme: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextState | null>(null);

export const ThemeProvider: FC<PropsProvider> = ({ children }) => {
	const deviceColorScheme = useColorScheme();
	const { colorScheme, setColorScheme, toggleColorScheme } = deviceColorScheme;

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const savedTheme = await AsyncStorage.getItem(THEME_ASYNC_STORAGE_KEY);
			if (savedTheme) {
				setColorScheme(savedTheme as ThemeName);
			} else if (deviceColorScheme) {
				setColorScheme(deviceColorScheme.colorScheme);
			}
		} catch (error) {
			console.error("Failed to load theme:", error);
		}
	};

	const saveTheme = async (newTheme: ThemeName) => {
		try {
			await AsyncStorage.setItem(THEME_ASYNC_STORAGE_KEY, newTheme);
		} catch (error) {
			console.error("Failed to save theme:", error);
		}
	};

	const setTheme = (newTheme: ThemeName) => {
		setColorScheme(newTheme);
		saveTheme(newTheme);
	};

	const toggleTheme = () => {
		toggleColorScheme();
	};

	const values = useMemo(() => {
		return {
			theme: colorScheme,
			toggleTheme,
			setTheme,
		};
	}, [colorScheme]);

	return <ThemeContext value={values}>{children}</ThemeContext>;
};
