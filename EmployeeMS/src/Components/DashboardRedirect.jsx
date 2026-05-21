import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        if (res.data.status) {
          const role = res.data.user.role;

          if (role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else if (role === "hr") {
            navigate("/hr/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
        }
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return null;
};

export default DashboardRedirect;
