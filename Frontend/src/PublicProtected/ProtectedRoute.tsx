import { Navigate } from "react-router-dom";
import { UseAuthContext } from "../Auth/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRole?: "EMPLOYEE" | "ADMIN";
}
export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { authUser,loading} = UseAuthContext();
  if (loading) {
    return null;
  }
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && authUser.role !== allowedRole) {
    return <Navigate to={authUser.role === "ADMIN" ? "/admin" : "/"} replace />
  }
  return <>{children}</>;
}
