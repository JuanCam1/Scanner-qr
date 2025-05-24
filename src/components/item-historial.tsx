import { useState, type FC } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { Check, Copy, Trash2 } from "lucide-react-native";
import type { HistorialModelI } from "@/model/historial-model";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";

interface Props {
	item: HistorialModelI;
	deleteHistorial: (id: string) => void;
}
const ItemHistorial: FC<Props> = ({ item, deleteHistorial }) => {
	const [copied, setCopied] = useState(false);

	const triggerHaptic = () => {
		if (Platform.OS !== "web") {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		}
	};

	const copyToClipboard = async () => {
		await Clipboard.setStringAsync(item.text);
		triggerHaptic();
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<View className="flex-row justify-between items-center p-2 overflow-hidden">
			<Text
				className="text-base text-gray-900 dark:text-white truncate w-[70%]"
				numberOfLines={1}
			>
				{item.text}
			</Text>
			<View className="flex flex-row gap-2 w-[25%] ">
				<TouchableOpacity
					onPress={() => deleteHistorial(item.id)}
					className="bg-red-400 p-2 rounded-md"
				>
					<Trash2 size={20} color="#ffffff" />
				</TouchableOpacity>
				<TouchableOpacity
					className="bg-purple-400 p-2 rounded-md"
					onPress={copyToClipboard}
				>
					{copied ? (
						<Check size={20} color="#ffffff" />
					) : (
						<Copy size={20} color="#ffffff" />
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
};
export default ItemHistorial;
