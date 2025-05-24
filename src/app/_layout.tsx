import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SplashScreen } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ScreenOrientation from "expo-screen-orientation";
import { ThemeProvider } from "@/context/theme-context";
import { HistorialProvider } from "@/context/historial-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);

	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	return (
		<ThemeProvider>
			<HistorialProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</GestureHandlerRootView>
			</HistorialProvider>
		</ThemeProvider>
	);
}
