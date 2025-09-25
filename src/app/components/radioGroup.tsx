"use client";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RadioGroup({
  name,
  options,
  selected,
  onChange,
  label,
}: RadioGroupProps) {
  return (
    <fieldset className="mb-4">
      {label && (
        <legend className="block text-sm font-medium text-foreground mb-2">
          {label}
        </legend>
      )}
      <div className="flex flex-col space-y-2" role="radiogroup">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-primary border-grey focus:ring-primary"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}