import { useState } from "react";
import { toast } from "sonner";

interface UseFetchReturn<T> {
	data: T | null;
	loading: boolean;
	error: Error | null;
	fn: (...args: any[]) => Promise<void>;
	setData: (data: T | null) => void;
}

const useFetch = <T = any>(
	callback: (...args: any[]) => Promise<T>,
): UseFetchReturn<T> => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fn = async (...args: any[]) => {
		setLoading(true);
		setError(null);

		try {
			const response = await callback(...args);
			setData(response);
			setError(null);
		} catch (err) {
			const error = err as Error;
			setError(error);
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, fn, setData };
};

export default useFetch;
