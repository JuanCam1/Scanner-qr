import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Switch, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, CameraOff, History } from "lucide-react-native";

import { useQrStore } from "@/store/qrStore";
import QrResultModal from "@/components/qr-result-modal";
import HistorialModal from "@/components/historial-modal";
import useTheme from "@/hook/use-theme";
import useHistorial from "@/hook/use-historial";

export default function QrScannerScreen() {
	const { theme, toggleTheme } = useTheme();
	const [permission, requestPermission] = useCameraPermissions();
	const { addHistorial } = useHistorial();
	const [scanned, setScanned] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [historialModal, setHistorialModal] = useState(false);
	const insets = useSafeAreaInsets();

	const { setScannedData } = useQrStore();

	const triggerHaptic = () => {
		if (Platform.OS !== "web") {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	};

	const handleBarCodeScanned = ({ data }: { data: string }) => {
		setScanned(true);
		triggerHaptic();
		setScannedData(data);
		setModalVisible(true);
		addHistorial(data);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setScanned(false);
	};

	const handleCloseHistorialModal = () => {
		setHistorialModal(false);
	};

	useEffect(() => {
		if (!permission || permission.status !== "granted") {
			requestPermission();
		}
	}, [permission, requestPermission]);

	if (!permission) {
		return (
			<View className="flex flex-1 justify-center items-center bg-gray-50">
				<Text className="text-base text-gray-700 text-center mb-4">
					Esperando permisos de cámara...
				</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View
				className="flex flex-1 justify-center items-center dark:bg-red-50"
				style={{
					paddingTop: insets.top,
				}}
			>
				<CameraOff size={48} color="#9ca3af" />
				<Text className="text-xl text-gray-700 text-center my-4">
					No hay acceso a la cámara
				</Text>
				<TouchableOpacity
					className="bg-violet-600 py-3 px-6 rounded-xl items-center justify-center self-center"
					onPress={requestPermission}
				>
					<Text className="text-white font-semibold text-base">
						Permitir acceso
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View
			className="relative flex flex-1 justify-center items-center bg-white dark:bg-zinc-900"
			style={{
				paddingTop: insets.top,
			}}
		>
			<View
				className="absolute top-0 right-0 p-4"
				style={{
					paddingTop: insets.top,
				}}
			>
				<Switch
					trackColor={{ false: "#767577", true: "#7c3aed" }}
					thumbColor="#f1f5f9"
					ios_backgroundColor="#3e3e3e"
					onValueChange={toggleTheme}
					value={theme === "dark"}
				/>
			</View>
			<View className="p-4 items-center">
				<Text className="text-4xl font-bold text-gray-900 mb-1 dark:text-purple-500">
					Escanear Código QR
				</Text>
				<Text className="text-xl text-zinc-600 dark:text-zinc-400 my-6">
					Escanea el código QR
				</Text>
			</View>

			<View className="w-full h-3/5 relative overflow-hidden rounded-xl mb-8 ">
				<CameraView
					active={!scanned}
					onBarcodeScanned={handleBarCodeScanned}
					barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
				/>
				<View className="absolute inset-0 justify-center items-center ">
					<View className="w-[230px] h-[230px] border-2 border-violet-600 rounded-2xl bg-transparent" />
				</View>
			</View>

			{scanned && (
				<TouchableOpacity
					className="flex-row bg-violet-600 py-3 px-6 rounded-xl items-center justify-center self-center mt-4"
					onPress={() => setScanned(false)}
				>
					<Camera size={20} color="#ffffff" />
					<Text className="text-white font-semibold text-base ml-2">
						Escanear de nuevo
					</Text>
				</TouchableOpacity>
			)}

			<QrResultModal visible={modalVisible} onClose={handleCloseModal} />

			<HistorialModal
				visible={historialModal}
				onClose={handleCloseHistorialModal}
			/>

			<TouchableOpacity
				className="absolute bottom-5 right-5 p-4 rounded-full bg-purple-500"
				style={{
					marginBottom: insets.bottom,
				}}
				activeOpacity={0.8}
				onPress={() => setHistorialModal(true)}
			>
				<History size={20} color="#ffffff" />
			</TouchableOpacity>
		</View>
	);
}
