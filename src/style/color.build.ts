import { writeFileSync } from "fs";
import { resolve } from "path";
import { argbFromHex, DynamicScheme, Hct, hexFromArgb, SchemeExpressive, Variant } from "@ktibow/material-color-utilities-nightly";

import { allColorNames, primaryColorNames, Scheme, toKebapCase, universalColorNames } from "./index.js";

const schemeDarkLight = (color: string) => {
	const sourceColorHct = Hct.fromInt(argbFromHex(color));
	return {
		dark: new DynamicScheme({ sourceColorHct, variant: Variant.EXPRESSIVE, contrastLevel: 0, isDark: true, specVersion: "2025" }),
		light: new DynamicScheme({ sourceColorHct, variant: Variant.EXPRESSIVE, contrastLevel: 0, isDark: false, specVersion: "2025" }),
	};
};

export const schemes: Record<Scheme, ReturnType<typeof schemeDarkLight>> = {
	primary: schemeDarkLight("#0085eb"),
	red: schemeDarkLight("#e62832"),
	green: schemeDarkLight("#00b43c"),
	blue: schemeDarkLight("#0085eb"),
	orange: schemeDarkLight("#d27814"),
};

const schemeToSass = (scheme: SchemeExpressive, color?: string) => {
	return [...primaryColorNames, ...(color && color !== "primary" ? [] : universalColorNames)].map(name => `--color-${color ? toKebapCase(name as string).replace("primary", color) : toKebapCase(name as string)}: ${hexFromArgb(scheme[name])};`).join("\n  ");
}

const sass = `${allColorNames.map(name => toKebapCase(name)).map(name => `$color-${name}: var(--color-${name});`).join("\n")}

:root {
	${schemeToSass(schemes.primary.light, "primary")}
	${schemeToSass(schemes.red.light, "red")}
	${schemeToSass(schemes.green.light, "green")}
	${schemeToSass(schemes.blue.light, "blue")}
	${schemeToSass(schemes.orange.light, "orange")}

@media (prefers-color-scheme: dark) {
	${schemeToSass(schemes.primary.dark, "primary")}
	${schemeToSass(schemes.red.dark, "red")}
	${schemeToSass(schemes.green.dark, "green")}
	${schemeToSass(schemes.blue.dark, "blue")}
	${schemeToSass(schemes.orange.dark, "orange")}
}
}
`;

writeFileSync(resolve(__dirname, "color.build.scss"), sass, "utf-8");