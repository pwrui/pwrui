export const universalColorNames = [
	"background", "onBackground", "surface", "surfaceDim", "surfaceBright", "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "surfaceVariant", "onSurfaceVariant", "inverseSurface", "inverseOnSurface", "outline", "outlineVariant", "shadow", "scrim", "surfaceTint", "error", "onError", "errorContainer", "onErrorContainer",
] as const;

export const schemeColorNames = [
	"primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "inversePrimary", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
] as const;

export const discreteColorNames = [
	"purple", "onPurple", "purpleContainer", "onPurpleContainer", "inversePurple", "purpleFixed", "purpleFixedDim", "onPurpleFixed", "onPurpleFixedVariant",
	"blue", "onBlue", "blueContainer", "onBlueContainer", "inverseBlue", "blueFixed", "blueFixedDim", "onBlueFixed", "onBlueFixedVariant",
	"teal", "onTeal", "tealContainer", "onTealContainer", "inverseTeal", "tealFixed", "tealFixedDim", "onTealFixed", "onTealFixedVariant",
	"green", "onGreen", "greenContainer", "onGreenContainer", "inverseGreen", "greenFixed", "greenFixedDim", "onGreenFixed", "onGreenFixedVariant",
	"yellow", "onYellow", "yellowContainer", "onYellowContainer", "inverseYellow", "yellowFixed", "yellowFixedDim", "onYellowFixed", "onYellowFixedVariant",
	"orange", "onOrange", "orangeContainer", "onOrangeContainer", "inverseOrange", "orangeFixed", "orangeFixedDim", "onOrangeFixed", "onOrangeFixedVariant",
	"red", "onRed", "redContainer", "onRedContainer", "inverseRed", "redFixed", "redFixedDim", "onRedFixed", "onRedFixedVariant",
] as const;

export const customColorNames = [
	"outlineOptional"
] as const;

export const allColorNames = [...universalColorNames, ...schemeColorNames, ...discreteColorNames, ...customColorNames] as const;

export const toKebapCase = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export type Scheme = "primary" | "purple" | "blue" | "teal" | "green" | "yellow" | "orange" | "red";

export const COLOR = Object.fromEntries(allColorNames.map(key => [key, `var(--color-${toKebapCase(key)})`])) as Record<typeof allColorNames[number], string>;