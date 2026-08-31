import { useState } from "react";
import { toast } from "sonner";

interface UseFetchReturn<TData, TArgs extends unknown[] = unknown[]> {
	data: TData | null;
	loading: boolean;
	error: Error | null;
	fn: (...args: TArgs) => Promise<TData | undefined>;
	setData: (data: TData | null) => void;
}

const useFetch = <TData, TArgs extends unknown[] = unknown[]>(
	callback: (...args: TArgs) => Promise<TData>,
): UseFetchReturn<TData, TArgs> => {
	const [data, setData] = useState<TData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fn = async (...args: TArgs): Promise<TData | undefined> => {
		setLoading(true);
		setError(null);

		try {
			const response = await callback(...args);
			setData(response);
			setError(null);
			return response;
		} catch (err) {
			const caughtError =
				err instanceof Error ? err : new Error("Something went wrong");
			setError(caughtError);
			toast.error(caughtError.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, fn, setData };
};

export default useFetch;
