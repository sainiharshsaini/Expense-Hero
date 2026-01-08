import { getUserAccounts, type SerializedAccount } from "@/actions/dashboard";
import { getTransaction } from "@/actions/transaction";
import { defaultCategories } from "@/data/categories";
import { authRequired } from "@/lib/auth/auth-utils";
import { AddTransactionForm } from "../_components/AddTransactionForm";

// Simple interface for search params
interface SearchParams {
	edit?: string;
}

interface PageProps {
	searchParams: Promise<SearchParams>;
}

export default async function AddTransactionPage({ searchParams }: PageProps) {
	await authRequired();

	const accounts: SerializedAccount[] = await getUserAccounts();
	const { edit: editId } = await searchParams;

	let initialData = null;
	if (editId) {
		const transaction = await getTransaction(editId);
		initialData = transaction;
	}

	return (
		<div className="max-w-3xl mx-auto px-5">
			<div className="flex justify-center md:justify-normal mb-8">
				<h1 className="text-5xl gradient-title ">
					{editId ? "Edit Transaction" : "Add Transaction"}
				</h1>
			</div>
			<AddTransactionForm
				accounts={accounts}
				categories={defaultCategories}
				editMode={!!editId}
				initialData={initialData}
			/>
		</div>
	);
}
