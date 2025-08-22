import { writeFileSync } from "fs";
import { resolve } from "path";
import { hexFromArgb, SchemeExpressive } from "@ktibow/material-color-utilities-nightly";

import { allColorNames, primaryColorNames, schemes, toKebapCase, universalColorNames } from ".";

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