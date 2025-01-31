import { HTMLAttributes, JSX, PropsWithChildren } from "react";
import { Icon } from "./Icon.js";


export function Spinner({ children, className, error, fullscreen = false, style, visible = true, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { error?: unknown, fullscreen?: boolean, visible?: boolean }>): JSX.Element {
	return <div
		className={`spinner ${visible ? "" : "hidden"} ${fullscreen ? "fullscreen" : ""} ${className ?? ""}`}
		style={error ? { ...style, color: "var(--color-red)" } : style}
		{...props}
	>
		{error
			? <>
				<Icon warning />
				<span>
					Error
				</span>
			</>
			: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48">
				<circle cx={24} cy={24} r={20} />
			</svg>
		}
	</div>;
}