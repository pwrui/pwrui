import { writeFileSync } from "fs";
import { resolve } from "path";
import { argbFromHex, Hct, hexFromArgb, MaterialDynamicColors, SchemeExpressive } from "@material/material-color-utilities";
import { capitalize, schemeColorNames, toKebapCase, universalColorNames } from "./index.js";

const colorThemes = {
  teal: "#13c2d9",
  blue: "#0085eb",
  red: "#782424",
  green: "#00b43c",
  orange: "#d28614",
  yellow: "#ffea00",
} as const;

const createSchemes = (hex: string, hueOffset = 0) => {
  const hct = Hct.fromInt(argbFromHex(hex));
  if (hueOffset) {
    hct.hue = (hct.hue + hueOffset + 360) % 360;
  }
  return {
    light: new SchemeExpressive(hct, false, 0),
    dark: new SchemeExpressive(hct, true, 0),
  };
};

const resolveColor = (token: string, scheme: SchemeExpressive): string => {
  const dynamicColor = (MaterialDynamicColors as Record<string, any>)[token];
  return dynamicColor ? hexFromArgb(dynamicColor.getArgb(scheme)) : "#ffffff";
};

const themeSchemes = Object.entries(colorThemes).map(([name, hex]) => ({
  name,
  universal: createSchemes(hex),
  adjusted: createSchemes(hex, 120),
}));

const generateDiscreteTokens = (mode: "light" | "dark") => {
  return themeSchemes
    .flatMap(({ name: themeName, adjusted }) => {
      const scheme = adjusted[mode];
      return schemeColorNames.map((schemeToken) => {
        const name = schemeToken.replace("primary", themeName).replace("Primary", capitalize(themeName));
        return `--color-${toKebapCase(name)}: ${resolveColor(schemeToken, scheme)};`;
      });
    })
    .join("\n");
};

const buildDynamicMap = (mode: "light" | "dark") => {
  return themeSchemes
    .map(({ name: themeName, universal, adjusted }) => {
      const formatEntries = (tokens: readonly string[], scheme: SchemeExpressive) =>
        tokens.map(token => `"${toKebapCase(token)}": ${resolveColor(token, scheme)}`);

      const entries = [
        ...formatEntries(universalColorNames, universal[mode]),
        ...formatEntries(schemeColorNames, adjusted[mode]),
      ];

      return `"${themeName}": (\n${entries.join(",\n")}\n)`;
    })
    .join(",\n");
};

const discreteColorNames = Object.keys(colorThemes).flatMap(theme =>
  schemeColorNames.map(token => token.replace("primary", theme))
);

const sassVariables = [...universalColorNames, ...schemeColorNames, ...discreteColorNames]
  .map(name => `$color-${toKebapCase(name)}: var(--color-${toKebapCase(name)});`)
  .join("\n");

const sass = `@use "sass:map";
${sassVariables}

$theme-colors-light: (${buildDynamicMap("light")});
$theme-colors-dark: (${buildDynamicMap("dark")});

:root { ${generateDiscreteTokens("light")} }
@media (prefers-color-scheme: dark) { :root { ${generateDiscreteTokens("dark")} } }

@mixin apply-theme($theme-name) {
  @each $token, $value in map.get($theme-colors-light, $theme-name) {
    --color-#{$token}: #{$value};
  }

  @media (prefers-color-scheme: dark) {
    @each $token, $value in map.get($theme-colors-dark, $theme-name) {
      --color-#{$token}: #{$value};
    }
  }
}`;

writeFileSync(resolve(import.meta.dirname, "color.build.scss"), sass, "utf-8");