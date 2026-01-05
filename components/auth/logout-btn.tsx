"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth/auth-client";

const LogoutBtn = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out");
    }
  };

  return (
    <Button
      variant="outline"
      className="ml-2"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutBtn;