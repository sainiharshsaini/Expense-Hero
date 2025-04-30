import { ReactNode } from "react"

interface AuthLayoutProps {
    children: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex justify-center py-40">
            {children}
        </div>
    )
}

export default AuthLayout