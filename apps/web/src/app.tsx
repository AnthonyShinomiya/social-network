// src/App.tsx
import { Route, useLocation, Switch } from "wouter-preact";
import { AnimatePresence } from "framer-motion";

import { useAuth } from "./features/auth/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { Sidebar } from "./components/Sidebar";

export function App() {
  const { me } = useAuth();
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {me && <Sidebar />}
      <Switch key={location} location={location}>
        {/* Rutas públicas (como hace Instagram con /accounts/...) */}
        <Route path="/accounts/login" component={LoginPage} />
        <Route path="/accounts/emailsignup" component={RegisterPage} />

        {/* Ruta raíz: feed principal (protegido) */}
        <Route path="/">
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        </Route>

        <Route component={NotFoundPage} />
      </Switch>
    </AnimatePresence>
  );
}
