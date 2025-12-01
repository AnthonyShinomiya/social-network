// src/App.tsx
import { Router, Route, useLocation } from "wouter-preact";
import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider } from "./features/auth/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";

function AnimatedRoutes() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="min-h-screen"
      >
        {/* Ruta pública */}
        <Route path="/login" component={LoginPage} />

        {/* Rutas protegidas */}
        <Route path="/">
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        </Route>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900 text-slate-50">
        <Router>
          <AnimatedRoutes />
        </Router>
      </div>
    </AuthProvider>
  );
}
