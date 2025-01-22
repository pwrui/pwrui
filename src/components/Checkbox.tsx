import { CSSProperties, JSX, PropsWithChildren, useEffect, useState } from "react";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";

export function Checkbox({ children, style, value, onValueChange, setCheckedOnPress = false }: PropsWithChildren<{ style?: CSSProperties, value: boolean, onValueChange?: (newValue: boolean) => void, setCheckedOnPress?: boolean }>): JSX.Element {
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
        <Icon style={{ color: checked ? "var(--color-primary)" : "var(--color-foreground-high)", height: "24px" }} icon={checked ? "check_box" : "check_box_outline_blank"} />
        {children ?? null}
    </Button>;
}