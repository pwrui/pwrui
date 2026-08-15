import { ComponentProps, FormEvent, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon.js";

type DropdownValue = string | number | boolean | object | null | undefined;

export type DropdownOption<Value extends DropdownValue> = {
	value: Value;
	label: ReactNode;
};

export function Dropdown<Value extends DropdownValue>({
	name,
	options,
	value,
	setValue,
	selectDefaultValue = true,
	captureInputs = false,
	defaultExpanded = false,
	defaultFilter = undefined,
	displayAsList = false,
	listDirection = "column",
	noOptionsMessage = "No options",
	ref,
	...props
}: ComponentProps<"div">
	& Pick<ComponentProps<"input">, "name" | "ref">
	& {
		options: readonly DropdownOption<Value>[],
		value?: Value,
		setValue: (value: Value) => void,
		selectDefaultValue?: boolean,
		captureInputs?: boolean,
		defaultExpanded?: boolean,
		defaultFilter?: string,
		displayAsList?: boolean,
		listDirection?: "row" | "column",
		noOptionsMessage?: string,
	}
): ReactElement {
	const dropdown = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [expanded, setExpanded] = useState(defaultExpanded);
	const [filter, setFilter] = useState<string | undefined>(defaultFilter);

	useEffect(() => {
		if (selectDefaultValue && options.length && !options.some(option => option.value === value)) {
			setValue(options[0].value);
		}
	}, [options, setValue]);

	useEffect(() => {
    if (expanded && listRef.current) {
      const activeItem = listRef.current.querySelector<HTMLElement>(".dropdown-item.active");
      if (activeItem) {
        activeItem.scrollIntoView({ block: "center" });
      }
    }
  }, [expanded]);

	useEffect(() => {
		if (!expanded) {
			setFilter(defaultFilter);
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

	const filteredOptions = useMemo(() => {
    if (!filter) return options;

    const needles = filter.toLocaleLowerCase().split(" ");

    return options.filter(option => {
      const labelIsString = typeof option.label === "string";
      const valueIsString = typeof option.value === "string";

      if (!labelIsString && !valueIsString) {
        return true;
      }

      const targetText = (labelIsString ? (option.label as string) : (option.value as string)).toLocaleLowerCase();
      return needles.every(needle => targetText.includes(needle));
    });
  }, [options, filter]);

	const list = <div className={`dropdown-list dropdown-list-${listDirection}`} ref={listRef}>
		<div {...(displayAsList ? props : {})}>
			{filteredOptions.length ? filteredOptions.map(option => <div
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
			</div>) : <div className="dropdown-item">{noOptionsMessage}</div>}
		</div>
	</div>;

	return <>
		<input type="hidden" readOnly value={value?.toString()} name={name} ref={ref} />
		{displayAsList
			? list
			: <div {...props} className={`dropdown ${expanded ? "dropdown-expanded" : ""}`} ref={dropdown} {...{
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
						!expanded || filter === undefined ? options.find(option => option.value == value)?.label : <><Icon search /><input type="text" autoFocus spellCheck={false} value={filter} {...{
							[captureInputs ? "onInputCapture" : "onInput"]: (event: FormEvent<HTMLInputElement>) => {
								if (captureInputs) {
									event.stopPropagation();
								}
								setFilter(event.currentTarget.value);
							}
						}} /></>
					) : <i>{noOptionsMessage}</i>}
				</div>
				<Icon icon={`keyboard_arrow_${expanded ? "up" : "down"}`} className="dropdown-icon" />
				{list}
			</div>
		}
	</>;
}