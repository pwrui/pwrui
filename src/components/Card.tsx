import { HTMLAttributes, JSX, PropsWithChildren } from "react";

export function Card({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>): JSX.Element {
  return <div className={`card ${className ?? ""}`} {...props}>
    {children}
  </div>;
}