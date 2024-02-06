import AdminNav from "../components/admin/AdminNav";

interface AdminLayoutProps {
    children:  React.ReactNode
}

export const metadata = {
    title: "Apple World Admin",
    descriptio: "Dashboard Apple World Admin"
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <div>
            <AdminNav />
            {children}
        </div>
    )
}

export default AdminLayout;