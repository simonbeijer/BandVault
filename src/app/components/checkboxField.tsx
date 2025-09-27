"use client";

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  required?: boolean;
}

const CheckboxField = ({ id, checked, onChange, children, required }: CheckboxFieldProps) => (
  <label className="flex items-start space-x-3 cursor-pointer group" htmlFor={id}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-1 w-4 h-4 text-primary bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 rounded focus:ring-primary focus:ring-2 transition-colors"
      required={required}
    />
    <span className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
      {children}
    </span>
  </label>
);

export default CheckboxField;
