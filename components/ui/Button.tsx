import React from "react";

type ButtonVariant = "primary" | "yellow" | "ghost" | "danger";
type ButtonSize = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1457D6] text-white hover:bg-[#0d44b0] active:bg-[#0a3690]",
  yellow:
    "bg-[#FFD21F] text-[#0B2A6B] shadow-[inset_0_0_0_2px_#0B2A6B] hover:bg-[#f5c800]",
  ghost:
    "bg-white text-[#0B2A6B] border-2 border-[#0B2A6B] hover:bg-[#EEF2F7]",
  danger:
    "bg-[#D42A25] text-white hover:bg-[#b82220]",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-[22px] min-h-[44px] text-[13px]",
  sm: "px-[16px] min-h-[40px] text-[12px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={[
        // base
        "inline-flex items-center justify-center gap-2 rounded-full border-0 cursor-pointer",
        "font-['Archivo_Black',sans-serif] uppercase tracking-tight leading-none",
        "transition-colors duration-150",
        // variant & size
        variantStyles[variant],
        sizeStyles[size],
        // full width
        fullWidth ? "w-full" : "",
        // disabled
        isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
