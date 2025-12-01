// src/components/PageContainer.tsx
import { type ComponentChildren } from "preact";

export function PageContainer({ children }: { children: ComponentChildren }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[935px] mx-auto w-full">{children}</div>
    </div>
  );
}
