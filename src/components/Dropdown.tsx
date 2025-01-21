import { HTMLProps, JSX, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.js";

function toggleClass(element: HTMLElement, className: string) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    } else {
        element.classList.add(className);
    }
}

export type DropdownOption = { value: string | number, label: JSX.Element | string };

export function Dropdown({ options, setValue, selectDefaultValue = true, displayAsList = false, ...props }: HTMLProps<HTMLDivElement> & { options: DropdownOption[], setValue: (value: string | number) => void, selectDefaultValue?: boolean, displayAsList?: boolean }): JSX.Element {
    const dropdown = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState(props.value);
    useEffect(() => {
        if (selectDefaultValue && options.length && !options.map(value => value.value).includes(props.value as string | number)) {
            setValue(options[0].value);
            setInputValue(options[0].value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- dependency to setValue breaks the behavior
    }, [options]);
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
                dropdown.current.classList.remove("expanded");
            }
        };
        document.addEventListener("click", listener);
        return () => document.removeEventListener("click", listener);
    }, [options]);
    const list = <div className="dropdown-list" style={{ maxHeight: displayAsList ? undefined : 220 }}>
        <div {...(displayAsList ? props : {})}>
            {options.length ? options.map(option => <div
                key={option.value}
                className={"dropdown-item" + (option.value == props.value ? " active" : "")}
                onClick={() => setValue(option.value)}
            >
                {option.label}
            </div>) : <div className="dropdown-item">No options available</div>}
        </div>
    </div>;
    return displayAsList ? list : <div {...props} className="dropdown" ref={dropdown} onClick={() => dropdown.current && options.length ? toggleClass(dropdown.current, "expanded") : null}>
        <div className="dropdown-value">
            {options.length ? options.find(option => option.value == props.value)?.label : <i>No options</i>}
        </div>
        <input type="hidden" value={inputValue} name={props.name} />
        <Icon style={{
            position: "absolute",
            top: "calc(50% - 0.5em)",
            right: 6,
            pointerEvents: "none",
        }} keyboard_arrow_down />
        {list}
    </div>;
}