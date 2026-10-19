import { ComponentProps, FormEvent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon.js";

type DropdownValue = string | number | boolean | object | null | undefined;

export type DropdownOption<Value extends DropdownValue> = {
	value: Value;
	label: ReactNode;
};

export function Dropdown<Value extends DropdownValue>({
	options,
	value = undefined,
	setValue = undefined,
	selectDefaultValue = true,
	captureInputs = false,
	defaultExpanded = false,
	filter = undefined,
	defaultFilter = undefined,
	defaultValue = undefined,
	displayAsList = false,
	readOnly = false,
	listDirection = "column",
	noOptionsMessage = <i>No options</i>,
	keyboardControls = undefined,
	name,
	ref,
	...props
}: {
	options: readonly DropdownOption<Value>[],
	value?: Value,
	setValue?: (value: Value) => void,
	selectDefaultValue?: boolean,
	captureInputs?: boolean,
	defaultExpanded?: boolean,
	filter?: string,
	defaultFilter?: string,
	defaultValue?: Value,
	displayAsList?: boolean,
	readOnly?: boolean,
	listDirection?: "row" | "column",
	noOptionsMessage?: ReactNode,
	keyboardControls?: boolean,
} & Omit<ComponentProps<"div">, "name" | "ref">
	& Pick<ComponentProps<"input">, "name" | "ref">
): ReactElement {
	const dropdown = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(defaultExpanded);
	const [internalFilter, setInternalFilter] = useState<string | undefined>(filter ?? defaultFilter);
	const [uncontrolledValue, setUncontrolledValue] = useState<Value | undefined>(value ?? defaultValue);
	const internalValue = value ?? uncontrolledValue;

	useEffect(() => {
		setInternalFilter(filter);
	}, [filter]);

	const setValueBoth = (updateValue: Value) => {
		setValue?.(updateValue);
		setUncontrolledValue(updateValue);
	};

	useEffect(() => {
		if (selectDefaultValue && options.length && !options.some(option => option.value === internalValue)) {
			setValueBoth(options[0].value);
		}
	}, [options]);

	useEffect(() => {
		const list = listRef.current;
		if (expanded && list) {
			if (list.scrollHeight > list.clientHeight) {
				list.querySelector(".dropdown-item.active")?.scrollIntoView({ block: "center" });
			}
		}
	}, [internalValue, expanded]);

	useEffect(() => {
		if (readOnly) {
			setExpanded(false);
		}
	}, [readOnly]);

	const filteredOptions = useMemo(() => {
		if (!internalFilter) return options;

		const needles = internalFilter.toLocaleLowerCase().split(" ");

		return options.filter(option => {
			const labelIsString = typeof option.label === "string";
			const valueIsString = typeof option.value === "string";

			if (!labelIsString && !valueIsString) {
				return true;
			}

			const targetText = (labelIsString ? (option.label as string) : (option.value as string)).toLocaleLowerCase();
			return needles.every(needle => targetText.includes(needle));
		});
	}, [options, internalFilter]);

	const filteredOptionValuePreview = useMemo(() => {
		return internalFilter && internalValue !== undefined && !filteredOptions.some(option => option.value === internalValue) ? filteredOptions[0]?.value : undefined;
	}, [filteredOptions, internalValue]);

	useEffect(() => {
		if (!expanded && filter === undefined) {
			setInternalFilter(defaultFilter);
		}
		const keydownListener = (event: KeyboardEvent) => {
			if (keyboardControls !== false && (expanded || keyboardControls)) {
				if (!internalFilter && /^[a-z0-9äöüß ]$/i.test(event.key)) {
					setInternalFilter("");
				}
				switch (event.key) {
					case "ArrowDown":
					case "ArrowUp":
						event.preventDefault();
						if (filteredOptions.length === 0) return;
						const currentIndex = filteredOptions.findIndex(o => o.value === (filteredOptionValuePreview ?? internalValue));
						let nextIndex = 0;
						if (event.key === "ArrowDown") {
							nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % filteredOptions.length;
						} else {
							nextIndex = currentIndex <= 0 ? filteredOptions.length - 1 : currentIndex - 1;
						}
						setValueBoth(filteredOptions[nextIndex].value);
						break;
					case "Enter":
						{
							const value = filteredOptionValuePreview ?? internalValue;
							if (value !== undefined) {
								setValueBoth(value);
								setExpanded(false);
							}
						}
						break;
					default:
						break;
				}
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
	}, [expanded, internalValue, filteredOptionValuePreview, internalFilter, filteredOptions]);

	const list = <div className={`dropdown-list dropdown-list-${listDirection}`}>
		<div {...(displayAsList ? props : {})} ref={listRef}>
			{filteredOptions.length ? filteredOptions.map(option => <div
				key={option.value?.toString()}
				className={"dropdown-item" + (option.value == (filteredOptionValuePreview ?? internalValue) ? " active" : "")}
				{...{
					[captureInputs ? "onClickCapture" : "onClick"]: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
						if (captureInputs) {
							event.stopPropagation();
						}
						setValueBoth(option.value);
					}
				}}
			>
				{option.label}
			</div>) : (noOptionsMessage && <div className="dropdown-item">{noOptionsMessage}</div>)}
		</div>
	</div>;

	return <>
		<input type="hidden" readOnly value={internalValue?.toString() ?? ""} name={name} ref={ref} />
		{displayAsList
			? list
			: <div {...props} className={`dropdown ${expanded ? "dropdown-expanded" : ""} ${readOnly ? "dropdown-read-only" : ""}`} ref={dropdown} {...{
				[captureInputs ? "onClickCapture" : "onClick"]: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
					if (captureInputs && !(event.target instanceof HTMLDivElement && event.target.classList.contains("dropdown-item"))) {
						event.stopPropagation();
					}
					if (dropdown.current && options.length && !(event.target instanceof HTMLInputElement) && !readOnly) {
						setExpanded(pre => !pre);
					}
				}
			}}>
				<div className="dropdown-value">
					{options.length ? (
						!expanded || internalFilter === undefined ? options.find(option => option.value == internalValue)?.label : <><Icon search /><input type="text" autoFocus spellCheck={false} value={internalFilter} {...{
							[captureInputs ? "onInputCapture" : "onInput"]: (event: FormEvent<HTMLInputElement>) => {
								if (captureInputs) {
									event.stopPropagation();
								}
								setInternalFilter(event.currentTarget.value);
							},
							[captureInputs ? "onKeyDownCapture" : "onKeyDown"]: (event: KeyboardEvent) => {
								if (event.key === "Enter") {
									if (captureInputs) {
										event.stopPropagation();
									}
									if (filteredOptionValuePreview !== undefined) {
										setValueBoth(filteredOptionValuePreview);
									}
									setExpanded(false);
								}
							}
						}} /></>
					) : noOptionsMessage}
				</div>
				<Icon icon={`keyboard_arrow_${expanded ? "up" : "down"}`} className="dropdown-icon" />
				{list}
			</div>
		}
	</>;
}

Dropdown.displayName = "Dropdown";