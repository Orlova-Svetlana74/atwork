import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTES } from "./routes";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} /> */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <div>Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
