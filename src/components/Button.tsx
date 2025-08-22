import { ComponentProps, JSX, MouseEvent, PropsWithChildren, useState } from "react";
import { COLOR, schemes } from "../style";

export function Button(props: PropsWithChildren<ComponentProps<"button"> & { onPress?: (event?: MouseEvent<HTMLButtonElement>) => void, scheme?: keyof typeof schemes }>): JSX.Element {
  const { style, onPress, children, scheme, ...otherProps } = props;
  const [ignorePress, setIgnorePress] = useState(false);
  return <button
    onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
      if (event.button === 0 && onPress) {
        event.stopPropagation();
        setIgnorePress(true);
        onPress(event);
      }
    }}
    onMouseUp={() => {

    }}
    onClick={(event: MouseEvent<HTMLButtonElement>) => {
      if (onPress) {
        event.stopPropagation();
        if (!ignorePress) {
          onPress(event);
        }
        setIgnorePress(false);
      }
    }}
    style={{
      ...(scheme ? {
        color: COLOR[`on${(scheme[0].toUpperCase() + scheme.substring(1)) as "Primary" | "Red" | "Green" | "Blue"}Container`],
        "--idle-background": COLOR[`${scheme}Container`],
        "--hover-background": `color-mix(in srgb, currentColor 8%, var(--idle-background))`,
        "--opacity-multiplier": 1,
      } : {}),
      ...style,
    }}
    type="button"
    {...otherProps}
  >
    {children}
  </button>;
}
