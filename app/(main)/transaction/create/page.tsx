import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { getUserAccounts, type SerializedAccount } from "@/actions/dashboard";
import {
	getTransaction,
	type SerializedTransactionForForm,
} from "@/actions/transaction";
import { defaultCategories } from "@/data/categories";
import { authRequired } from "@/lib/auth/auth-utils";
import { AddTransactionForm } from "../_components/AddTransactionForm";

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

	let initialData: SerializedTransactionForForm | null = null;
	if (editId) {
		initialData = await getTransaction(editId);
	}

	return (
		<div className="max-w-3xl mx-auto px-5">
			<div className="flex justify-center md:justify-normal mb-8">
				<h1 className="text-5xl gradient-title ">
					{editId ? "Edit Transaction" : "Add Transaction"}
				</h1>
			</div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center p-12 glass-panel border-white/10 rounded-3xl">
						<Loader2 className="h-10 w-10 animate-spin text-primary" />
					</div>
				}
			>
				<AddTransactionForm
					accounts={accounts}
					categories={defaultCategories}
					editMode={!!editId}
					initialData={initialData}
				/>
			</Suspense>
		</div>
	);
}
