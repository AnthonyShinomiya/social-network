// src/App.tsx
import { Route, useLocation, Switch } from "wouter-preact";
import { AnimatePresence } from "framer-motion";

import { AuthProvider } from "./features/auth/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";

export function App() {
  const [location] = useLocation();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait" initial={false}>
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
        </Switch>
      </AnimatePresence>
    </AuthProvider>
  );
}
