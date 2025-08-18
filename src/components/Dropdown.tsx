import { ComponentProps, JSX, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon.js";

export type DropdownOption = { value: string | number, label: JSX.Element | string };

export function Dropdown({ options, value, setValue, selectDefaultValue = true, displayAsList = false, ref, ...props }: ComponentProps<"div"> & Pick<ComponentProps<"input">, "name" | "ref"> & { options: DropdownOption[], value?: string | number, setValue: (value: string | number) => void, selectDefaultValue?: boolean, displayAsList?: boolean }): JSX.Element {
  const dropdown = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (selectDefaultValue && options.length && !options.some(option => option.value === value)) {
      setValue(options[0].value);
    }
  }, [options, setValue]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  }, [setExpanded]);

  const list = <div className="dropdown-list" style={{ maxHeight: displayAsList ? undefined : 220 }}>
    <div {...(displayAsList ? props : {})}>
      {options.length ? options.map(option => <div
        key={option.value}
        className={"dropdown-item" + (option.value == value ? " active" : "")}
        onClick={() => setValue(option.value)}
      >
        {option.label}
      </div>) : <div className="dropdown-item">No options available</div>}
    </div>
  </div>;

  return <>
    <input type="hidden" value={value} name={props.name} ref={ref} />
    {displayAsList
      ? list
      : <div {...props} className={`dropdown ${expanded ? "expanded" : ""}`} ref={dropdown} onClick={() => dropdown.current && options.length ? setExpanded(pre => !pre) : null}>
        <div className="dropdown-value">
          {options.length ? options.find(option => option.value == value)?.label : <i>No options</i>}
        </div>
        <Icon keyboard_arrow_down className="dropdown-icon" />
        {list}
      </div>
    }
  </>;
}