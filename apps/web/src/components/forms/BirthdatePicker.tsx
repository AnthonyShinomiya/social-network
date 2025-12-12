// src/components/BirthdatePicker.tsx
import { ChevronDown, Calendar } from "lucide-preact";
import { useState, useEffect } from "preact/hooks";

type Props = {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
};

type MonthOption = [value: string, label: string];

export function BirthdatePicker({ value, onChange }: Props) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // Parse inicial
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      setYear(y);
      setMonth(m);
      setDay(d);
    }
  }, [value]);

  // Emitir la fecha completa
  useEffect(() => {
    if (year && month && day) {
      onChange(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    }
  }, [year, month, day, onChange]);

  const years = Array.from(
    { length: 120 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  const months: MonthOption[] = [
    ["01", "Enero"],
    ["02", "Febrero"],
    ["03", "Marzo"],
    ["04", "Abril"],
    ["05", "Mayo"],
    ["06", "Junio"],
    ["07", "Julio"],
    ["08", "Agosto"],
    ["09", "Septiembre"],
    ["10", "Octubre"],
    ["11", "Noviembre"],
    ["12", "Diciembre"],
  ];

  const daysInMonth = new Date(
    Number(year || 2000),
    Number(month || 1),
    0
  ).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

  return (
    <div
      className="
        w-full flex items-center gap-3
        pb-3
        border-b border-gray-300
        transition-colors
        focus-within:border-b-cyan-500
      "
    >
      {/* Icono tal como el resto de inputs */}
      <Calendar className="size-4 text-gray-500 shrink-0" />

      {/* Selects */}
      <DateSelect
        value={day}
        onChange={setDay}
        placeholder="Día"
        options={days}
      />

      <DateSelect
        value={month}
        onChange={setMonth}
        placeholder="Mes"
        options={months}
        labels
      />

      <DateSelect
        value={year}
        onChange={setYear}
        placeholder="Año"
        options={years}
      />
    </div>
  );
}

function DateSelect({
  value,
  onChange,
  placeholder,
  options,
  labels = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: any[];
  labels?: boolean;
}) {
  const baseClass =
    "w-full bg-transparent text-sm outline-none appearance-none pr-6";

  // placeholder (valor vacío)
  const textClass = value === "" ? "text-gray-400" : "text-gray-800";

  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className={`${baseClass} ${textClass}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {labels
          ? options.map(([val, label]: any) => (
              <option key={val} value={val} className="text-gray-800">
                {label}
              </option>
            ))
          : options.map((o) => (
              <option key={o} value={o} className="text-gray-800">
                {o}
              </option>
            ))}
      </select>

      <ChevronDown
        className="
          size-4 text-gray-500
          absolute right-1 top-1/2 -translate-y-1/2
          pointer-events-none
        "
      />
    </div>
  );
}
