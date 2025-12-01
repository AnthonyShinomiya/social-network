import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";

render(
  <AuthProvider>
    <App />
  </AuthProvider>,

  document.getElementById("app")!
);
