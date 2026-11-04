import React from "react";

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement> | React.SelectHTMLAttributes<HTMLSelectElement>>;
}

export default function Field({
  label,
  id,
  error,
  hint,
  required,
  children,
}: FieldProps) {
  // Clone child element to inject id, aria attributes, and error styling
  const child = React.cloneElement(children, {
    id,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
    "aria-invalid": error ? true : undefined,
    className: [
      "w-full px-[16px] py-[12px] border-2 rounded-xl",
      "font-['Space_Mono',monospace] text-[13px] bg-white box-border min-h-[44px]",
      "outline-none transition-colors duration-150",
      error
        ? "border-[#D42A25] focus:border-[#D42A25] focus:ring-2 focus:ring-[#D42A25]/20"
        : "border-[#0B2A6B] focus:border-[#1457D6] focus:ring-2 focus:ring-[#1457D6]/20",
      (children.props as React.HTMLAttributes<HTMLElement>).className ?? "",
    ]
      .filter(Boolean)
      .join(" "),
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="font-['Space_Mono',monospace] text-[12px] font-bold uppercase text-[#0B2A6B] mb-[6px] mt-[14px]"
      >
        {label}
        {required && (
          <span className="text-[#D42A25] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {child}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 font-['Space_Mono',monospace] text-[11px] text-[#D42A25] font-bold"
        >
          {error}
        </p>
      )}

      {hint && !error && (
        <p
          id={`${id}-hint`}
          className="mt-1 font-['Space_Mono',monospace] text-[11px] text-[#0B2A6B]/60"
        >
          {hint}
        </p>
      )}
    </div>
  );
}
