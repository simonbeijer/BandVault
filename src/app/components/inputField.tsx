"use client";

interface InputFieldProps {
  name: string;
  type: "email" | "password" | "text";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  error?: boolean;
}

export default function InputField({
  name,
  type,
  value,
  onChange,
  placeholder,
  label,
  error,
}: InputFieldProps) {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg text-black placeholder-grey focus:outline-none focus:ring-2 focus:ring-primary bg-background";
  const errorClasses = error ? "border-red-500" : "border-grey";
  const inputClasses = `${baseClasses} ${errorClasses}`.trim();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClasses}
        aria-invalid={!!error}
      />
    </div>
  );
}
