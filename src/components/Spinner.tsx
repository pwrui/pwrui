import { Icon } from "./Icon.js";

export function Spinner({ error, fullscreen = false, visible = true }: { error?: unknown, fullscreen?: boolean, visible?: boolean }) {
	return <div className={`spinner ${visible ? "" : "hidden"} ${fullscreen ? "fullscreen" : ""}`}>
		{error
			? <>
				<Icon style={{ color: "var(--color-red)" }} warning />
				<span style={{ color: "var(--color-red)" }}>
					Error
				</span>
			</>
			: <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48">
				<circle cx={24} cy={24} r={20} />
			</svg>
		}
	</div>;
}