import { ComponentProps, ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { Button } from "./Button.js";
import { Icon } from "./Icon.js";
import { COLOR } from "../style/index.js";

export function Checkbox({
  children,
  checked,
  defaultChecked,
  name,
  onChange,
  ref,
  setChecked,
  style,
  ...props
}:
  Omit<ComponentProps<"button">, "onChange" | "ref">
  & Pick<ComponentProps<"input">, "name" | "onChange" | "ref">
  & {
    checked?: boolean,
    defaultChecked?: boolean,
    setChecked?: (value: boolean) => void,
  }
): ReactElement {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);
  const isChecked = checked ?? uncontrolledChecked;
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    console.log("useEffect", name, "setChecked", uncontrolledChecked);
    setChecked?.(uncontrolledChecked);
  }, [setChecked, uncontrolledChecked]);

  return <>
    <input type="checkbox" style={{ display: "none" }} readOnly checked={isChecked} name={name} ref={ref} />
    <Button
      onPress={useCallback(() => {
        if (typeof checked === "boolean") {
          setChecked?.(!checked);
        } else {
          setUncontrolledChecked(prev => !prev);
        }
      }, [setChecked, setUncontrolledChecked])}
      style={{ ...style }}
      className="transparent"
      {...props}
    >
      <Icon style={{ color: isChecked ? COLOR.primary : COLOR.outlineVariant, height: "24px" }} icon={isChecked ? "check_box" : "check_box_outline_blank"} />
      {children ?? null}
    </Button>
  </>;
}