// src/pages/RegisterPage.tsx
import { useState } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { Mail, Lock, User, Share2, AlertCircle, Loader2 } from "lucide-preact";

import { useAuth } from "@/features/auth/AuthContext";
import { BirthdatePicker } from "@/components/BirthdatePicker";
import { InputLine } from "@/components/forms/InputLine";
import { normalizeError } from "@/utils/normalizeError";

export function RegisterPage() {
  const { register, error: rawError } = useAuth();
  const [, navigate] = useLocation();

  const [fullName, setFullName] = useState("");
  const [birthdate, setBirthdate] = useState(""); // YYYY-MM-DD
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const error = normalizeError(rawError, "Error al crear la cuenta.");

  async function onSubmit(e: Event) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await register(fullName, email, birthdate, password);
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white grid place-items-center p-4">
      <form
        onSubmit={onSubmit}
        className="
          w-full max-w-sm px-10 py-12
          rounded-2xl bg-white
          border border-gray-200
          shadow-xl
        "
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="
              size-12 rounded-full grid place-content-center
              bg-gradient-to-br from-sky-300/20 to-fuchsia-300/20
              border border-gray-200
            "
          >
            <Share2 className="size-6 text-cyan-600" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-10">
          Crear cuenta
        </h1>

        {/* Nombre completo */}
        <InputLine
          icon={<User className="size-4 text-gray-500" />}
          placeholder="Nombre completo"
          value={fullName}
          onInput={(e) =>
            setFullName((e.currentTarget as HTMLInputElement).value)
          }
        />

        <div className="mt-6" />

        {/* Fecha de nacimiento */}
        <BirthdatePicker value={birthdate} onChange={setBirthdate} />

        <div className="mt-6" />

        {/* Email */}
        <InputLine
          icon={<Mail className="size-4 text-gray-500" />}
          placeholder="Email"
          type="email"
          value={email}
          onInput={(e) => setEmail((e.currentTarget as HTMLInputElement).value)}
        />

        <div className="mt-6" />

        {/* Contraseña */}
        <InputLine
          icon={<Lock className="size-4 text-gray-500" />}
          placeholder="Contraseña"
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
              rounded-xl border border-red-300
              bg-red-100 px-3 py-2
              text-sm text-red-700
            "
          >
            <AlertCircle className="size-4 mt-0.5 shrink-0" />
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
            shadow-md
            transition-all duration-200
            hover:brightness-[1.06]
            active:brightness-[0.97]
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {submitting ? (
            <Loader2 className="size-6 animate-spin text-white/90" />
          ) : (
            "Registrarse"
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/accounts/login"
            className="text-cyan-600 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
