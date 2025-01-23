import { CSSProperties, JSX } from "react";
import { MaterialSymbol } from "material-symbols";

export type IconType = MaterialSymbol;

export function Icon({ className = "", icon, ...props }: { [K in Exclude<IconType, "style">]?: boolean } & { className?: string, icon?: IconType, style?: CSSProperties | boolean }): JSX.Element {
    return <span className={`icon material-symbols-outlined ${className}`} style={typeof props.style === "boolean" ? {} : props.style}>
        {Object.entries({ ...props, ...(icon !== undefined ? { [icon]: true } : {}) }).map(([key, value]) => value === true ? key : "").join("")}
    </span>;
}