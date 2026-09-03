import { writeFileSync } from "fs";
import { resolve } from "path";
import { argbFromHex, Hct, hexFromArgb, MaterialDynamicColors, SchemeTonalSpot } from "@material/material-color-utilities";

import { allColorNames, schemeColorNames, Scheme, toKebapCase, universalColorNames } from "./index.js";

const schemeDarkLight = (color: string) => {
  const sourceColorHct = Hct.fromInt(argbFromHex(color));
  return {
    dark: new SchemeTonalSpot(sourceColorHct, true, 0),
    light: new SchemeTonalSpot(sourceColorHct, false, 0),
  };
};

export const schemes: Record<Scheme, ReturnType<typeof schemeDarkLight>> = {
  primary: schemeDarkLight("#0085eb"),
  red: schemeDarkLight("#782424"),
  green: schemeDarkLight("#00b43c"),
  blue: schemeDarkLight("#0085eb"),
  orange: schemeDarkLight("#d28914"),
};

const schemeToSass = (scheme: SchemeTonalSpot, color?: string) => {
  return [...schemeColorNames, ...(color && color !== "primary" ? [] : universalColorNames)]
    .map(name => {
      const dynamicColor = (MaterialDynamicColors as Record<string, any>)[name];
      const argb = dynamicColor ? dynamicColor.getArgb(scheme) : 0;
      return `--color-${color ? toKebapCase(name as string).replace("primary", color) : toKebapCase(name as string)}: ${hexFromArgb(argb)};`;
    })
    .join("\n  ");
};

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