import { useState, useEffect } from "react";
import { service } from "../services";
import { IAssistant } from "../types/interfaces";
import { useAuth } from "@clerk/clerk-react";

/**
 * Custom hook that fetches and returns a list of assistants.
 *
 * @returns {Object} An object containing the list of assistants, loading state, and error state.
 * @property {Array} assistants - The list of assistants.
 * @property {boolean} isLoading - A boolean indicating if the data is currently being fetched.
 * @property {Error|null} error - An error object if an error occurred during the fetch, otherwise null.
 */
export const useAssistants = () => {
	const [assistants, setAssistants] = useState<IAssistant[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { getToken } = useAuth();

	useEffect(() => {
		const fetchAssistants = async () => {
			setIsLoading(true);

			try {
				const result: IAssistant[] =
					await service.assistantService.getAssistants(await getToken());
				setAssistants(result);
			} catch (error: any) {
				setError(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAssistants();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // The empty array ensures this effect runs only once after the initial render

	return { assistants, setAssistants, isLoading, error };
};
