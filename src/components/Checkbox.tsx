import { ComponentProps, ReactElement, useCallback, useState } from "react";

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
  const internalChecked = checked ?? uncontrolledChecked;

  return <>
    <input type="checkbox" style={{ display: "none" }} readOnly checked={internalChecked} name={name} ref={ref} />
    <Button
      onPress={useCallback(() => {
        const next = !(checked ?? uncontrolledChecked);
        if (checked === undefined) setUncontrolledChecked(next);
        setChecked?.(next);
      }, [checked, setChecked, setUncontrolledChecked])}
      style={{ ...style }}
      className="transparent"
      {...props}
    >
      <Icon style={{ color: internalChecked ? COLOR.primary : COLOR.outlineVariant, height: "24px" }} icon={internalChecked ? "check_box" : "check_box_outline_blank"} />
      {children ?? null}
    </Button>
  </>;
}

Checkbox.displayName = "Checkbox";