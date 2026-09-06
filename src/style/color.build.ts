import { writeFileSync } from "fs";
import { resolve } from "path";
import { argbFromHex, Hct, hexFromArgb, MaterialDynamicColors, SchemeExpressive } from "@material/material-color-utilities";
import { capitalize, schemeColorNames, toKebapCase, universalColorNames } from "./index.js";

const colorThemes = {
  purple: "#7900eb",
  blue: "#0085eb",
  teal: "#13c2d9",
  green: "#00b43c",
  yellow: "#ffea00",
  orange: "#d28614",
  red: "#782424",
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
$color-outline-optional: var(--color-outline-optional);
@mixin color-outline {
  outline: 1px solid $color-outline-optional;
  outline-offset: -1px;
}

$theme-colors-light: (${buildDynamicMap("light")});
$theme-colors-dark: (${buildDynamicMap("dark")});

:root { ${generateDiscreteTokens("light")} --color-outline-optional: transparent; }
@media (prefers-color-scheme: dark) { :root { ${generateDiscreteTokens("dark")} } }

@mixin color-scheme($theme-name) {
  @each $token, $value in map.get($theme-colors-light, $theme-name) {
    --color-#{$token}: #{$value};
  }
  &[data-outline] {
    --color-outline-optional: color-mix(in srgb, #{$color-outline-variant} 33%, transparent);
  }

  @media (prefers-color-scheme: dark) {
    @each $token, $value in map.get($theme-colors-dark, $theme-name) {
      --color-#{$token}: #{$value};
      &[data-outline] {
        --color-outline-optional: color-mix(in srgb, #{$color-outline-variant} 66%, transparent);
      }
    }
  }
}`;

writeFileSync(resolve(import.meta.dirname, "color.build.scss"), sass, "utf-8");