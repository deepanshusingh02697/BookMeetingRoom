import { Navigate } from "react-router-dom";
import { UseAuthContext } from "../Auth/AuthContext";

interface Props {
  children: React.ReactNode;
}
export default function PublicRoute({ children }: Props) {
  const { authUser, loading } = UseAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (authUser) {
    if (authUser?.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
