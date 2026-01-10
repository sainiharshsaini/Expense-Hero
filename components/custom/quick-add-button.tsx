"use client";

import { ArrowDownRight, ArrowUpRight, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function QuickAddButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="quick-action-fab">
            {/* Quick Action Menu */}
            <div className={`quick-action-menu ${isOpen ? "open" : ""}`}>
                <Link
                    href="/transaction/create?type=income"
                    className="quick-action-item slide-up group"
                    onClick={() => setIsOpen(false)}
                >
                    <span className="text-sm font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                        Add Income
                    </span>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                        <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                    </div>
                </Link>

                <Link
                    href="/transaction/create?type=expense"
                    className="quick-action-item slide-up group"
                    style={{ animationDelay: "50ms" }}
                    onClick={() => setIsOpen(false)}
                >
                    <span className="text-sm font-bold text-foreground group-hover:text-red-500 transition-colors">
                        Add Expense
                    </span>
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                    </div>
                </Link>
            </div>

            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`quick-action-btn ${isOpen ? "" : "float"}`}
                aria-label={isOpen ? "Close menu" : "Add transaction"}
            >
                <div
                    className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                        }`}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                </div>
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
