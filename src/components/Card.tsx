import { ComponentProps, PropsWithChildren, ReactElement } from "react";

export function Card({ children, className, ...props }: PropsWithChildren<ComponentProps<"div">>): ReactElement {
  return <div className={`card ${className ?? ""}`} {...props}>
    {children}
  </div>;
}