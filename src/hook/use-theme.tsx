import { use } from "react";
import { ThemeContext } from "@/context/theme-context";

const useTheme = () => {
	const context = use(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
export default useTheme;
