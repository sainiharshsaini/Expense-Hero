import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import DashboardPage from "./page";

const DashboardLayout = () => {
	return (
		<div>
			<Suspense
				fallback={<BarLoader className="mt-4" width={"100%"} color="#0f766e" />}
			>
				<DashboardPage />
			</Suspense>
		</div>
	);
};

export default DashboardLayout;
