import { CSSProperties, PropsWithChildren, ReactElement, useEffect, useState } from "react";

import { Button } from "./Button.js";
import { Icon } from "./Icon.js";
import { COLOR } from "../style/index.js";

export function Checkbox({ children, style, value, onValueChange, setCheckedOnPress = false }: PropsWithChildren<{ style?: CSSProperties, value: boolean, onValueChange?: (newValue: boolean) => void, setCheckedOnPress?: boolean }>): ReactElement {
  const [checked, setChecked] = useState(value);
  useEffect(() => {
    if (value !== checked) {
      setChecked(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- useRef(checked) or adding checked as dependency breaks the behavior
  }, [value]);
  return <Button
    onPress={() => {
      if (setCheckedOnPress) {
        setChecked(!checked);
      }
      onValueChange?.(!checked);
    }}
    style={{ ...style }}
    className="transparent"
  >
    <Icon style={{ color: checked ? COLOR.primary : COLOR.outlineVariant, height: "24px" }} icon={checked ? "check_box" : "check_box_outline_blank"} />
    {children ?? null}
  </Button>;
}