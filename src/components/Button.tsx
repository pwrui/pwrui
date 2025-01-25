import { ButtonHTMLAttributes, JSX, MouseEvent, PropsWithChildren, useState } from "react";

export function Button(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { onPress?: (event?: MouseEvent<HTMLButtonElement>) => void, theme?: string }>): JSX.Element {
  const { style, onPress, children, theme, ...otherProps } = props;
  const [ignorePress, setIgnorePress] = useState(false);
  return (
    <button
      onMouseDown={(event: MouseEvent<HTMLButtonElement>) => {
        if (event.button === 0) {
          event.stopPropagation();
          setIgnorePress(true);
          onPress?.(event);
        }
      }}
      onMouseUp={() => {

      }}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!ignorePress) {
          onPress?.(event);
        }
        setIgnorePress(false);
      }}
      style={{
        ...style,
        ...(theme ? {
          color: theme,
          backgroundColor: `color-mix(in srgb, ${theme} var(--opacity-color-low), var(--color-background))`,
          "--color-shape-medium": `color-mix(in srgb, ${theme} var(--opacity-color-medium), var(--color-background))`,
        } : {}),
      }}
      type="button"
      {...otherProps}
    >
      {children}
    </button>
  );
}