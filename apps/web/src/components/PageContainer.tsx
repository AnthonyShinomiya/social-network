// src/components/PageContainer.tsx
import { type ComponentChildren } from "preact";

export function PageContainer({ children }: { children: ComponentChildren }) {
  return (
    <div className="min-h-screen ps-24 xl:ps-6 p-6 bg-gradient">
      <div className="max-w-[935px] mx-auto w-full">{children}</div>
    </div>
  );
}
