import { Navigate, Outlet, useLocation } from "react-router-dom";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function AdminRoute() {
  const location = useLocation();
  const storedAuth = localStorage.getItem("auth");

  if (!storedAuth) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  let token = "";

  try {
    const parsed = JSON.parse(storedAuth);
    token = parsed?.token || "";
  } catch {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const decoded = parseJwt(token);

  if (!decoded) {
    return <Navigate to="/signin" replace />;
  }

  if (Number(decoded?.role) !== 2) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;