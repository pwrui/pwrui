import { ComponentProps, JSX, PropsWithChildren } from "react";

export function Card({ children, className, ...props }: PropsWithChildren<ComponentProps<"div">>): JSX.Element {
  return <div className={`card ${className ?? ""}`} {...props}>
    {children}
  </div>;
}