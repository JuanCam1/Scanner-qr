import { type FC, useState } from "react";
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	Linking,
	Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { X, ExternalLink, Copy, Check } from "lucide-react-native";

import { useQrStore } from "@/store/qrStore";

interface ModalProps {
	visible: boolean;
	onClose: () => void;
}

const QrResultModal: FC<ModalProps> = ({ visible, onClose }) => {
	const { scannedData } = useQrStore();
	const [copied, setCopied] = useState(false);

	const isUrl = (text: string) => {
		return (
			text.startsWith("http://") ||
			text.startsWith("https://") ||
			text.startsWith("www.")
		);
	};

	const copyToClipboard = async () => {
		if (scannedData) {
			await Clipboard.setStringAsync(scannedData);
			triggerHaptic();
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const triggerHaptic = () => {
		if (Platform.OS !== "web") {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	};

	const openLink = async () => {
		// if (scannedData && isUrl(scannedData)) {
		if (scannedData) {
			triggerHaptic();

			let url = scannedData;
			if (url.startsWith("www.")) {
				url = `https://${url}`;
			}

			const canOpen = await Linking.canOpenURL(url);
			if (canOpen) {
				await Linking.openURL(url);
			} else {
				alert("Cannot open this URL");
			}
		}
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-end bg-black/50 dark:bg-zinc-950/70">
				<View className="bg-white dark:bg-zinc-900 rounded-t-xl p-3 shadow-lg">
					<View className="flex-row justify-between items-center mb-5">
						<Text className="text-3xl font-bold text-purple-500">
							QR Resultado
						</Text>
						<TouchableOpacity className="p-1" onPress={onClose}>
							<X size={24} color="#6b7280" />
						</TouchableOpacity>
					</View>

					<View className="mb-6">
						<Text className="text-base font-semibold text-gray-700 dark:text-zinc-400 mb-6">
							Contenido escaneado:
						</Text>
						<View className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 min-h-[100px]">
							<Text
								className="text-base text-gray-900 dark:text-white"
								numberOfLines={5}
							>
								{scannedData}
							</Text>
						</View>
					</View>

					<View className="flex-row justify-between">
						<TouchableOpacity
							className="flex-1 flex-row items-center justify-center py-3 px-6 rounded-xl bg-violet-600 mx-1.5"
							onPress={copyToClipboard}
						>
							{copied ? (
								<Check size={20} color="#ffffff" />
							) : (
								<Copy size={20} color="#ffffff" />
							)}
							<Text className="text-white font-semibold text-base ml-2">
								{copied ? "Copied!" : "Copy"}
							</Text>
						</TouchableOpacity>

						{isUrl(scannedData) && (
							<TouchableOpacity
								className="flex-1 flex-row items-center justify-center py-3 px-6 rounded-xl bg-teal-500 mx-1.5"
								onPress={openLink}
							>
								<ExternalLink size={20} color="#ffffff" />
								<Text className="text-white font-semibold text-base ml-2">
									Open
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default QrResultModal;
