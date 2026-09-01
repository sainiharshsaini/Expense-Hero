"use client";

import {
  AlertCircle,
  Check,
  Pencil,
  RefreshCw,
  TrendingDown,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCurrentBudget, updateBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import useFetch from "@/hooks/useFetch";
import { cn } from "@/lib/utils";

type Budget = {
  amount: number;
};

type BudgetProgressProps = {
  initialBudget: Budget | null;
  accountId: string;
};

const BudgetProgress = ({ initialBudget, accountId }: BudgetProgressProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || "",
  );
  const [mounted, setMounted] = useState(false);
  const [currentExpenses, setCurrentExpenses] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { loading, fn: updateBudgetFn, data, error } = useFetch(updateBudget);

  // Fetch current expenses from server
  const fetchCurrentExpenses = async () => {
    try {
      setIsRefreshing(true);
      const budgetData = await getCurrentBudget(accountId);
      setCurrentExpenses(budgetData.currentExpenses);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchCurrentExpenses();

    // Refresh expenses every 5 seconds to keep it updated
    const interval = setInterval(fetchCurrentExpenses, 5000);

    return () => clearInterval(interval);
  }, [accountId]);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    await updateBudgetFn(amount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (
      typeof data === "object" &&
      data !== null &&
      "success" in data &&
      (data as { success: boolean }).success
    ) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
      fetchCurrentExpenses();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error((error as Error).message || "Failed to update budget");
    }
  }, [error]);

  const percentUsed100 = Math.min(percentUsed, 100);
  const isNearing = percentUsed >= 75;
  const isExceeded = percentUsed >= 100;

  const getProgressColor = () => {
    if (isExceeded) return "bg-gradient-to-r from-red-500 to-red-600";
    if (isNearing) return "bg-gradient-to-r from-amber-500 to-amber-600";
    return "bg-gradient-to-r from-emerald-500 to-emerald-600";
  };

  const getStatusColor = () => {
    if (isExceeded) return "text-red-600";
    if (isNearing) return "text-amber-600";
    return "text-emerald-600";
  };

  if (!mounted) {
    return (
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardContent className="p-6">
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600">
                Monthly Budget
              </h3>
            </div>

            {!isEditing && initialBudget ? (
              <div className="mt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-gray-900">
                    ${currentExpenses.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    of ${initialBudget.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : isEditing ? (
              <div className="flex items-center gap-2 mt-3">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    $
                  </span>
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-lg pl-7 text-gray-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    autoFocus
                    disabled={loading}
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleUpdateBudget}
                  disabled={loading}
                  className="h-10 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="h-10 px-3 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="link"
                onClick={() => setIsEditing(true)}
                className="p-0 h-auto text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
              >
                + Set budget
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && initialBudget && (
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCurrentExpenses}
                disabled={isRefreshing}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Refresh budget data"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                />
              </Button>
            )}
            {!isEditing && initialBudget && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Section */}
        {initialBudget && (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Progress
                </span>
                <span className={cn("text-sm font-bold", getStatusColor())}>
                  {percentUsed100.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getProgressColor(),
                  )}
                  style={{ width: `${percentUsed100}%` }}
                />
              </div>
            </div>

            {/* Status Message */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isExceeded
                      ? "bg-red-500"
                      : isNearing
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                />
                <span className="text-xs font-medium text-gray-600">
                  {isExceeded
                    ? "Budget exceeded"
                    : isNearing
                      ? "Approaching limit"
                      : "Good standing"}
                </span>
              </div>
              {isExceeded && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-semibold">Over limit</span>
                </div>
              )}
            </div>

            {/* Remaining Amount */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-600">
                <span className="font-medium">
                  $
                  {Math.max(
                    0,
                    initialBudget.amount - currentExpenses,
                  ).toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">remaining</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
