import { argbFromHex, DynamicScheme, Hct, Variant } from "@ktibow/material-color-utilities-nightly";

const schemeDarkLight = (color: string) => {
	const sourceColorHct = Hct.fromInt(argbFromHex(color));
	return {
		dark: new DynamicScheme({ sourceColorHct, variant: Variant.EXPRESSIVE, contrastLevel: 0, isDark: true, specVersion: "2025" }),
		light: new DynamicScheme({ sourceColorHct, variant: Variant.EXPRESSIVE, contrastLevel: 0, isDark: false, specVersion: "2025" }),
	};
};

export const schemes = {
	primary: schemeDarkLight("#0085eb"),
	red: schemeDarkLight("#e62832"),
	green: schemeDarkLight("#00b43c"),
	blue: schemeDarkLight("#0085eb"),
	orange: schemeDarkLight("#d27814"),
};

export const universalColorNames = [
	"background", "onBackground", "surface", "surfaceDim", "surfaceBright", "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "onSurface", "surfaceVariant", "onSurfaceVariant", "inverseSurface", "inverseOnSurface", "outline", "outlineVariant", "shadow", "scrim", "surfaceTint", "error", "onError", "errorContainer", "onErrorContainer",
] as const;

export const primaryColorNames = [
	"primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "inversePrimary", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
] as const;

export const discreteColorNames = [
	"red", "onRed", "redContainer", "onRedContainer", "inverseRed", "redFixed", "redFixedDim", "onRedFixed", "onRedFixedVariant",
	"green", "onGreen", "greenContainer", "onGreenContainer", "inverseRed", "greenFixed", "greenFixedDim", "onRedFixed", "onRedFixedVariant",
	"blue", "onBlue", "blueContainer", "onBlueContainer", "inverseBlue", "blueFixed", "blueFixedDim", "onBlueFixed", "onBlueFixedVariant",
	"orange", "onOrange", "orangeContainer", "onOrangeContainer", "inverseRed", "orangeFixed", "orangeFixedDim", "onRedFixed", "onRedFixedVariant",
] as const;

export const allColorNames = [...universalColorNames, ...primaryColorNames, ...discreteColorNames] as const;

export const toKebapCase = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export const COLOR = Object.fromEntries(allColorNames.map(key => [key, `var(--color-${toKebapCase(key)})`])) as Record<typeof allColorNames[number], string>;

export const primaryColorNameByDiscreteColor = (name: typeof discreteColorNames[number]) => primaryColorNames[discreteColorNames.indexOf(name) % primaryColorNames.length];