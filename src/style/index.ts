export const universalColorNames = [
	"background", "onBackground", "surface", "surfaceDim", "surfaceBright", "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "surfaceVariant", "onSurfaceVariant", "inverseSurface", "inverseOnSurface", "outline", "outlineVariant", "shadow", "scrim", "surfaceTint", "error", "onError", "errorContainer", "onErrorContainer",
] as const;

export const schemeColorNames = [
	"primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "inversePrimary", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
] as const;

export const discreteColorNames = [
	"red", "onRed", "redContainer", "onRedContainer", "inverseRed", "redFixed", "redFixedDim", "onRedFixed", "onRedFixedVariant",
	"green", "onGreen", "greenContainer", "onGreenContainer", "inverseRed", "greenFixed", "greenFixedDim", "onRedFixed", "onRedFixedVariant",
	"blue", "onBlue", "blueContainer", "onBlueContainer", "inverseBlue", "blueFixed", "blueFixedDim", "onBlueFixed", "onBlueFixedVariant",
	"orange", "onOrange", "orangeContainer", "onOrangeContainer", "inverseRed", "orangeFixed", "orangeFixedDim", "onRedFixed", "onRedFixedVariant",
] as const;

export const allColorNames = [...universalColorNames, ...schemeColorNames, ...discreteColorNames] as const;

export const toKebapCase = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export type Scheme = "primary" | "red" | "green" | "blue" | "orange";

export const COLOR = Object.fromEntries(allColorNames.map(key => [key, `var(--color-${toKebapCase(key)})`])) as Record<typeof allColorNames[number], string>;