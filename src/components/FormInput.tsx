import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  className,
}: FormInputProps) => {
  return (
    <div className={cn("relative", className)}>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        required={required}
        className="h-12 border-border bg-card text-card-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-primary"
      />
      <span className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-card px-1 text-xs text-primary">
        {label}
      </span>
    </div>
  );
};
