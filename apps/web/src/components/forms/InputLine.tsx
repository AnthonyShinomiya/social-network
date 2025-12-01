// src/components/forms/InputLine.tsx
import { type ComponentChildren } from "preact";

export type InputLineProps = {
  icon: ComponentChildren;
  placeholder: string;
  type?: string;
  value: string;
  onInput: (e: any) => void;
};

export function InputLine({
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
        border-b border-gray-300
        focus-within:border-b-cyan-500
        transition-colors
      "
    >
      <div className="shrink-0">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onInput={onInput}
        className="
          flex-1 bg-transparent outline-none
          text-gray-800 placeholder-gray-400
          text-sm
        "
      />
    </div>
  );
}
