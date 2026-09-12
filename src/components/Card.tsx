import { ComponentProps, PropsWithChildren, ReactElement } from "react";

export function Card({ children, className, noPadding, ...props }: PropsWithChildren<ComponentProps<"div">> & { noPadding?: boolean }): ReactElement {
  return <div className={`card ${className ?? ""} ${noPadding ? "no-padding" : ""}`} {...props}>
    {children}
  </div>;
}