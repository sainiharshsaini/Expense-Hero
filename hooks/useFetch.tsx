import { useState } from "react";
import { toast } from "sonner";

type AsyncFunction<TArgs extends any[], TReturn> = (...args: TArgs) => Promise<TReturn>;

const useFetch = <TArgs extends any[], TReturn>(cb: AsyncFunction<TArgs, TReturn>) => {
    const [data, setData] = useState<TReturn | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const fn = async (...args: TArgs): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error("Unknown error");
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };
};

export default useFetch;