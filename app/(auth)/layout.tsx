import type { ReactNode } from "react";
import AuthLayout from "@/components/auth/auth-layout";

const Layout = ({ children }: { children: ReactNode }) => {
	return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
