// src/pages/LoginPage.tsx
import { type ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { useAuth } from "../features/auth/AuthContext";
import { Mail, Lock, Share2, AlertCircle, Loader2 } from "lucide-preact";

// Normaliza el error en caso de venir como JSON
function normalizeError(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    try {
      const parsed = JSON.parse(error);
      if (parsed && typeof parsed === "object" && "error" in parsed) {
        const msg = (parsed as any).error;
        if (typeof msg === "string") return msg;
      }
    } catch {
      /* no es JSON */
    }
    return error;
  }

  if (error instanceof Error) return error.message;

  return "Ha ocurrido un error al iniciar sesión.";
}

export function LoginPage() {
  const { login, error: rawError } = useAuth();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const error = normalizeError(rawError);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05060a] grid place-items-center p-4">
      <form
        onSubmit={onSubmit}
        className="
          w-full max-w-sm px-10 py-12
          rounded-2xl
          bg-[#111219]/95 backdrop-blur-xl
          border border-white/5
          shadow-[0_20px_60px_rgba(0,0,0,0.7)]
        "
      >
        {/* Icono superior */}
        <div className="flex justify-center mb-6">
          <div
            className="
              size-12 rounded-full grid place-content-center
              bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20
              border border-white/10
              shadow-[0_0_26px_rgba(56,189,248,0.35)]
            "
          >
            <Share2 className="size-6 text-cyan-200" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center text-cyan-100 mb-10">
          Iniciar sesión
        </h1>

        <InputLine
          icon={<Mail className="size-4 text-gray-400" />}
          placeholder="Email"
          type="email"
          value={email}
          onInput={(e) => setEmail((e.currentTarget as HTMLInputElement).value)}
        />

        <div className="mt-6" />

        <InputLine
          icon={<Lock className="size-4 text-gray-400" />}
          placeholder="Password"
          type="password"
          value={password}
          onInput={(e) =>
            setPassword((e.currentTarget as HTMLInputElement).value)
          }
        />

        {error && (
          <div
            className="
              mt-6 flex items-start gap-2
              rounded-xl border border-pink-400/40
              bg-pink-500/10 px-3 py-2
              text-sm text-pink-200
            "
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <button
          disabled={submitting}
          className="
            w-full mt-10 py-2.5
            rounded-xl
            bg-gradient-to-r from-sky-400 via-cyan-400 to-fuchsia-500
            text-white font-semibold
            shadow-[0_10px_25px_rgba(0,0,0,0.55)]
            transition-all duration-200
            hover:brightness-[1.06]
            hover:shadow-[0_14px_34px_rgba(0,0,0,0.55)]
            active:brightness-[0.97]
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {submitting ? (
            <Loader2 className="size-6 animate-spin text-white/90" />
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}

type InputLineProps = {
  icon: ComponentChildren;
  placeholder: string;
  type?: string;
  value: string;
  onInput: (e: any) => void;
};

function InputLine({
  icon,
  placeholder,
  type = "text",
  value,
  onInput,
}: InputLineProps) {
  return (
    <div
      className="
        w-full flex items-center gap-3
        pb-3
        border-b border-white/10
        focus-within:border-b-cyan-400
        transition-colors
      "
    >
      <div className="shrink-0">{icon}</div>
      <input
        className="
          flex-1 bg-transparent outline-none
          text-gray-100 placeholder-gray-500
          text-sm
        "
        type={type}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
      />
    </div>
  );
}
