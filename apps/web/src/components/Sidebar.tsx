// src/components/Sidebar.tsx
import { useState } from "preact/hooks";
import { Link, useRoute } from "wouter-preact";
import { useAuth } from "../features/auth/AuthContext";
import { getInitialsFromMe } from "../lib/getInitials";
import {
  Home,
  Search,
  Compass,
  Bell,
  Plus,
  Share2,
  type LucideIcon,
} from "lucide-preact";
import clsx from "clsx";
import type { FunctionComponent } from "preact";

type NavIcon = FunctionComponent<{ size?: number }> | LucideIcon;

export function Sidebar() {
  const { me } = useAuth();
  const [expanded, setExpanded] = useState(false);

  if (!me) return null;

  const initials = getInitialsFromMe(me);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={clsx(
        "fixed left-0 top-0 bottom-0 z-50 h-screen bg-white transition-all duration-300 p-3 flex flex-col",
        expanded ? "w-64" : "w-20"
      )}
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10">
        <div className="ml-1 rounded-full bg-sky-50 p-2">
          <Share2 className="w-6 h-6 text-sky-500" />
        </div>
      </div>

      {/* NAV */}
      <nav className="space-y-1.5 flex-1">
        <NavItem Icon={Home} label="Inicio" href="/" expanded={expanded} />
        <NavItem
          Icon={Search}
          label="Buscar"
          href="/search"
          expanded={expanded}
        />
        <NavItem
          Icon={Compass}
          label="Explorar"
          href="/explore"
          expanded={expanded}
        />
        <NavItem
          Icon={Bell}
          label="Notificaciones"
          href="/notifications"
          expanded={expanded}
        />
        <NavItem Icon={Plus} label="Crear" href="/create" expanded={expanded} />
      </nav>

      {/* PERFIL */}
      <div className="mt-6">
        <NavItem
          Icon={() => (
            <div className="size-7 rounded-full bg-slate-200 text-slate-800 grid place-content-center font-semibold text-sm">
              {initials}
            </div>
          )}
          label="Perfil"
          href="/profile"
          expanded={expanded}
        />
      </div>
    </aside>
  );
}

function NavItem({
  Icon,
  label,
  href,
  expanded,
}: {
  Icon: NavIcon;
  label: string;
  href: string;
  expanded: boolean;
}) {
  const [match] = useRoute(href);
  const active = Boolean(match);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-4 rounded-xl px-3 py-2.5 transition-all select-none",
        "text-slate-800 hover:bg-slate-100",
        active ? "opacity-100" : "opacity-50"
      )}
    >
      {/* ICON WRAPPER (aquí es donde aplicamos bg-slate-200 ONLY if active) */}
      <div
        className={clsx(
          "aspect-square size-7 flex items-center justify-center transition-colors"
        )}
      >
        <Icon size={26} strokeWidth={active ? 2.25 : 1.75} />
      </div>

      {/* LABEL solo cuando está expandido */}
      <span
        className={clsx(
          "text-[15px] transition-opacity duration-200",
          expanded ? "opacity-100" : "opacity-0 pointer-events-none",
          active ? "font-bold" : "font-light"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
