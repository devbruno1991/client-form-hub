import { cn } from "@/lib/utils";

interface RadioOptionProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  selectedValue: string;
}

export const RadioOption = ({
  label,
  name,
  value,
  onChange,
  selectedValue,
}: RadioOptionProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-primary">{label}</span>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={name}
          value="sim"
          checked={selectedValue === "sim"}
          onChange={() => onChange("sim")}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-sm text-muted-foreground">Sim</span>
      </label>
      <label className="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={name}
          value="nao"
          checked={selectedValue === "nao"}
          onChange={() => onChange("nao")}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-sm text-muted-foreground">Não</span>
      </label>
    </div>
  );
};
