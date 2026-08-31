import type { ReactNode } from "react";
import AppFooter from "@/components/custom/app-footer";
import AppHeader from "@/components/custom/app-header";

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<>
			<AppHeader />
			<main className="container mx-auto px-5 pb-16 pt-28 md:px-8">
				{children}
			</main>
			<AppFooter />
		</>
	);
};

export default MainLayout;
