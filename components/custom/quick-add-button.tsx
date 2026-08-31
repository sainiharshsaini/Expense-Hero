"use client";

import { ArrowDownRight, ArrowUpRight, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function QuickAddButton() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="quick-action-fab">
			{isOpen && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: Backdrop click
				// biome-ignore lint/a11y/noStaticElementInteractions: Backdrop click
				<div
					className="fixed inset-0 z-40 bg-transparent"
					onClick={() => setIsOpen(false)}
				/>
			)}

			<div className={`quick-action-menu ${isOpen ? "open" : ""} z-50`}>
				<Link
					href="/transaction/create?type=income"
					className="quick-action-item group animate-in fade-in slide-in-from-bottom-2 duration-200"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-sm font-medium text-foreground group-hover:text-emerald-600 transition-colors">
						Add Income
					</span>
					<div className="flex h-9 w-9 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 transition-colors group-hover:bg-emerald-100">
						<ArrowUpRight className="h-5 w-5 text-emerald-600" />
					</div>
				</Link>

				<Link
					href="/transaction/create?type=expense"
					className="quick-action-item group animate-in fade-in slide-in-from-bottom-2 duration-200"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-sm font-medium text-foreground group-hover:text-red-600 transition-colors">
						Add Expense
					</span>
					<div className="flex h-9 w-9 items-center justify-center rounded-md border border-red-200 bg-red-50 transition-colors group-hover:bg-red-100">
						<ArrowDownRight className="h-5 w-5 text-red-600" />
					</div>
				</Link>
			</div>

			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`quick-action-btn ${isOpen ? "" : ""} z-50`}
				aria-label={isOpen ? "Close menu" : "Add transaction"}
			>
				<div
					className={`transition-all duration-500 ease-spring ${
						isOpen ? "rotate-45" : ""
					}`}
				>
					{isOpen ? (
						<X className="h-8 w-8 text-white" />
					) : (
						<Plus className="h-8 w-8 text-white" />
					)}
				</div>
			</button>
		</div>
	);
}
