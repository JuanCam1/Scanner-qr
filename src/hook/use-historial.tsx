import { HistorialContext } from "@/context/historial-context";
import { use } from "react";

const useHistorial = () => {
	const context = use(HistorialContext);
	if (!context) {
		throw new Error("useHistorial must be used within a HistorialProvider");
	}

	return context;
};
export default useHistorial;
