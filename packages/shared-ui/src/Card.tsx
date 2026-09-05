import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: Readonly<CardProps>) {
  return (
    <div
      className={`rounded-lg border border-line bg-surface p-6 text-ink ${className}`}
      {...props}
    />
  )
}