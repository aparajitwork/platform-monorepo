import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-accent text-accent-ink hover:opacity-90",
    secondary: "border border-line bg-surface text-ink hover:bg-line/40"
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}