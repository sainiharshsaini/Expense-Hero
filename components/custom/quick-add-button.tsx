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
					className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 animate-in fade-in duration-500"
					onClick={() => setIsOpen(false)}
				/>
			)}

			<div className={`quick-action-menu ${isOpen ? "open" : ""} z-50`}>
				<Link
					href="/transaction/create?type=income"
					className="quick-action-item group animate-in fade-in slide-in-from-bottom-4 duration-500"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-sm font-black uppercase tracking-widest text-foreground group-hover:text-emerald-400 transition-colors drop-shadow-sm">
						Add Income
					</span>
					<div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-emerald-500/20">
						<ArrowUpRight className="h-6 w-6 text-emerald-400" />
					</div>
				</Link>

				<Link
					href="/transaction/create?type=expense"
					className="quick-action-item group animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75"
					onClick={() => setIsOpen(false)}
				>
					<span className="text-sm font-black uppercase tracking-widest text-foreground group-hover:text-red-400 transition-colors drop-shadow-sm">
						Add Expense
					</span>
					<div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-red-500/20">
						<ArrowDownRight className="h-6 w-6 text-red-400" />
					</div>
				</Link>
			</div>

			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`quick-action-btn ${isOpen ? "" : "float shadow-primary/40"} hover:shadow-primary/60 z-50`}
				aria-label={isOpen ? "Close menu" : "Add transaction"}
			>
				<div
					className={`transition-all duration-500 ease-spring ${isOpen ? "rotate-45" : ""
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
