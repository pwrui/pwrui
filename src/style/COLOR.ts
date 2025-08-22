import { allColorNames, toKebapCase } from "./index.js";

export const COLOR = Object.fromEntries(allColorNames.map(key => [key, `var(--color-${toKebapCase(key)})`])) as Record<typeof allColorNames[number], string>;