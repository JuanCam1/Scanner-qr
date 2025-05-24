import {
	createContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HistorialModelI } from "@/model/historial-model";
import { randomId } from "@/lib/random-id";
const ASYNC_STORAGE_KEY = "historial-values";

interface PropsProvider {
	children: ReactNode;
}

interface HistorialContextstate {
	historial: HistorialModelI[];
	addHistorial: (text: string) => void;
	deleteHistorial: (id: string) => void;
	clearHistorial: () => void;
}

export const HistorialContext = createContext<HistorialContextstate | null>(
	null,
);

export const HistorialProvider = ({ children }: PropsProvider) => {
	const [historial, setHistorial] = useState<HistorialModelI[]>([]);

	useEffect(() => {
		loadHistorial();
	}, []);

	useEffect(() => {
		if (historial.length > 0) {
			saveHistorial();
		}
	}, [historial]);

	const loadHistorial = async () => {
		try {
			const historialValues = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);

			if (historialValues) {
				const loadedHistorial = JSON.parse(historialValues);

				setHistorial(loadedHistorial);
			}
		} catch (error) {
			console.error("Failed to load historial:", error);
		}
	};

	const saveHistorial = async () => {
		try {
			await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(historial));
		} catch (error) {
			console.error("Failed to save historial:", error);
		}
	};

	const addHistorial = (text: string) => {
		const existe = historial.some((item) => item.text === text);

		if (!existe) {
			setHistorial([
				...historial,
				{
					id: randomId(),
					text: text,
				},
			]);
		}
	};

	const deleteHistorial = (id: string) => {
		setHistorial(historial.filter((p) => p.id !== id));
	};

	const clearHistorial = () => {
		setHistorial([]);
		AsyncStorage.removeItem(ASYNC_STORAGE_KEY);
	};

	const values = useMemo(() => {
		return {
			historial,
			addHistorial,
			deleteHistorial,
			clearHistorial,
		};
	}, [historial]);

	return <HistorialContext value={values}>{children}</HistorialContext>;
};
