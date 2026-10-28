import Link from "next/link";

const variants = {
  primary:
    "bg-neutral-950 text-white hover:bg-orange-500 hover:text-neutral-950",
  secondary: "bg-orange-500 text-neutral-950 hover:bg-orange-400",
  outline:
    "border border-neutral-300 bg-white/50 text-neutral-900 hover:border-neutral-950 hover:bg-neutral-950 hover:text-white",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-black/[0.05] hover:text-neutral-950",
  light: "bg-white text-neutral-950 hover:bg-orange-100",
};

const sizes = {
  sm: "min-h-9 gap-2 px-3.5 text-xs",
  md: "min-h-11 gap-2.5 px-5 text-sm",
  lg: "min-h-12 gap-3 px-6 text-sm",
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) {
  const classes = [
    "inline-flex items-center justify-center rounded-full",
    "font-medium transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-orange-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={`${classes} ${disabled ? "pointer-events-none opacity-50" : ""}`}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
