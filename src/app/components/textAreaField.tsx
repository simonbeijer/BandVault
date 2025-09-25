"use client";

// A simplified TextAreaField component.

interface TextAreaFieldProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  rows?: number;
}

export default function TextAreaField({
  name,
  value,
  onChange,
  label,
  placeholder,
  error,
  rows = 4,
}: TextAreaFieldProps) {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg bg-white dark:bg-white text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-primary";
  const errorClasses = error ? "border-red-500" : "border-grey";
  const textareaClasses = `${baseClasses} ${errorClasses}`.trim();

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={textareaClasses}
        aria-invalid={!!error}
      />
    </div>
  );
}
