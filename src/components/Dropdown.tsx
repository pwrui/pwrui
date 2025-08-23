import { ComponentProps, FormEvent, ReactElement, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.js";

type DropdownValue = string | number | boolean | object | null | undefined;

export type DropdownOption<Value extends DropdownValue> = {
	value: Value;
	label: ReactElement | string;
};

export function Dropdown<Value extends DropdownValue>({
	options,
	value,
	setValue,
	selectDefaultValue = true,
	captureInputs = false,
	displayAsList = false,
	ref,
	...props
}: ComponentProps<"div">
	& Pick<ComponentProps<"input">, "name" | "ref">
	& {
		options: DropdownOption<Value>[],
		value?: Value,
		setValue: (value: Value) => void,
		selectDefaultValue?: boolean,
		captureInputs?: boolean,
		displayAsList?: boolean,
	}
): ReactElement {
	const dropdown = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(false);
	const [filter, setFilter] = useState<string | undefined>();

	useEffect(() => {
		if (selectDefaultValue && options.length && !options.some(option => option.value === value)) {
			setValue(options[0].value);
		}
	}, [options, setValue]);

	useEffect(() => {
		if (!expanded) {
			setFilter(undefined);
		}
		const keydownListener = (event: KeyboardEvent) => {
			if (expanded && !filter && /^[a-zA-Z0-9_ ]$/.test(event.key)) {
				setFilter("");
			}
		};
		const clickListener = (event: MouseEvent) => {
			if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
				setExpanded(false);
			}
		};
		document.addEventListener("keydown", keydownListener);
		document.addEventListener("click", clickListener);
		return () => {
			document.removeEventListener("keydown", keydownListener);
			document.removeEventListener("click", clickListener);
		};
	}, [expanded, filter, setExpanded]);

	const list = <div className="dropdown-list" style={{ maxHeight: displayAsList ? undefined : 220 }}>
		<div {...(displayAsList ? props : {})}>
			{options.length ? options.filter(option => !filter || (typeof option.value !== "string" || filter.split(" ").every(needle => (option.value as string).includes(needle)))).map(option => <div
				key={option.value?.toString()}
				className={"dropdown-item" + (option.value == value ? " active" : "")}
				{...{
					[captureInputs ? "onClickCapture" : "onClick"]: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
						if (captureInputs) {
							event.stopPropagation();
						}
						setValue(option.value);
					}
				}}
			>
				{option.label}
			</div>) : <div className="dropdown-item">No options available</div>}
		</div>
	</div>;

	return <>
		<input type="hidden" value={value?.toString()} name={props.name} ref={ref} />
		{displayAsList
			? list
			: <div {...props} className={`dropdown ${expanded ? "expanded" : ""}`} ref={dropdown} {...{
				[captureInputs ? "onClickCapture" : "onClick"]: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					if (captureInputs && !(event.target instanceof HTMLDivElement && event.target.classList.contains("dropdown-item"))) {
						event.stopPropagation();
					}
					if (dropdown.current && options.length) {
						setExpanded(pre => !pre);
					}
				}
			}}>
				<div className="dropdown-value">
					{options.length ? (
						filter === undefined ? options.find(option => option.value == value)?.label : <><Icon filter_list /><input type="text" autoFocus spellCheck={false} value={filter} {...{
							[captureInputs ? "onInputCapture" : "onInput"]: (event: FormEvent<HTMLInputElement>) => {
								if (captureInputs) {
									event.stopPropagation();
								}
								setFilter(event.currentTarget.value);
							}
						}} /></>
					) : <i>No options</i>}
				</div>
				<Icon icon={`keyboard_arrow_${expanded ? "up" : "down"}`} className="dropdown-icon" />
				{list}
			</div>
		}
	</>;
}