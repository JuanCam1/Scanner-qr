import type { FC } from "react";
import {
	Alert,
	FlatList,
	Modal,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Trash2, X } from "lucide-react-native";
import useHistorial from "@/hook/use-historial";
import ItemHistorial from "./item-historial";

interface ModalProps {
	visible: boolean;
	onClose: () => void;
}

const HistorialModal: FC<ModalProps> = ({ visible, onClose }) => {
	const { historial, deleteHistorial, clearHistorial } = useHistorial();

	const handleClearHistorial = () => {
		Alert.alert(
			"Eliminar todo el historial",
			"¿Estás seguro de eliminar todo el historial?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "Eliminar",
					onPress: () => {
						clearHistorial();
						onClose();
					},
				},
			],
		);
	};

	const handleDeleteHistorial = (id: string) => {
		Alert.alert(
			"Eliminar del historial",
			"¿Estás seguro de eliminar este registro?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{ text: "Eliminar", onPress: () => deleteHistorial(id) },
			],
		);
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View className="flex-1 justify-end bg-black/50 dark:bg-zinc-950/70">
				<View className="bg-white dark:bg-zinc-900 rounded-t-xl p-3 shadow-lg h-auto max-h-[80%]">
					<View className="flex-row justify-between items-center mb-5 mt-3">
						<View className="flex-row items-center gap-4">
							<TouchableOpacity
								onPress={handleClearHistorial}
								className="bg-red-400 p-2 rounded-md"
							>
								<Trash2 size={20} color="#ffffff" />
							</TouchableOpacity>
							<Text className="text-3xl font-bold text-purple-500">
								Historial
							</Text>
						</View>
						<TouchableOpacity className="p-1" onPress={onClose}>
							<X size={24} color="#6b7280" />
						</TouchableOpacity>
					</View>

					<View className="bg-gray-100 dark:bg-zinc-800 rounded-xl">
						<FlatList
							data={historial}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<ItemHistorial
									item={item}
									deleteHistorial={handleDeleteHistorial}
								/>
							)}
							ListEmptyComponent={() => (
								<View className="flex-1 justify-center items-center p-6">
									<Text className="text-gray-400 text-base">
										No hay historial disponible
									</Text>
								</View>
							)}
							ItemSeparatorComponent={() => (
								<View className="h-px bg-gray-300 dark:bg-zinc-600" />
							)}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
};
export default HistorialModal;
