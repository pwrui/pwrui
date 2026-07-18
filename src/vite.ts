import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Plugin } from "vite";
import { IconType } from "pwrui";

const CSS_URL_BASE = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
const UA = "Mozilla/5.0 AppleWebKit/500 Chrome/100";

const VIRTUAL_MODULE_ID = "pwrui/symbols-dynamic.css";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

let globalFontPromise: Promise<string> | null = null;

const fetchFontDataUri = async (srcDir: string, extraIcons: IconType[]): Promise<string> => {
  const icons = new Set<string>(extraIcons);
  const files = readdirSync(srcDir, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.[jt]sx?$/.test(entry.name))
    .map(entry => join(entry.parentPath, entry.name));

  for (const file of files) {
    const code = readFileSync(file, "utf-8");
    for (const [, name] of code.matchAll(/<Icon\b[^>]*\b([a-z][a-z0-9_]+)(?=\s*(?:\/?>|\s+[a-z]))/g)) {
      if (!["icon", "className", "size"].includes(name)) icons.add(name);
    }
    for (const [, name] of code.matchAll(/\bicon=\{?["']([a-z][a-z0-9_]+)["']\}?/g)) {
      icons.add(name);
    }
    for (const [, expr] of code.matchAll(/\bicon=\{([^}]+)\}/g)) {
      for (const [, name] of expr.matchAll(/["']([a-z][a-z0-9_]+)["']/g)) {
        icons.add(name);
      }
    }
  }

  if (!icons.size) return "";

  const sorted = [...icons].sort();
  console.log(`[pwrui] Generating material symbols font with ${sorted.length} icons.`);

  try {
    const css = await fetch(`${CSS_URL_BASE}&icon_names=${sorted.join(",")}`, { headers: { "User-Agent": UA } }).then(r => r.text());
    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\(['"]woff2['"]\)/);
    if (!match) throw new Error("No woff2 URL found in retrieved CSS.");

    const fontBuffer = await fetch(match[1]).then(r => r.arrayBuffer());
    return Buffer.from(fontBuffer).toString("base64");
  } catch (error) {
    console.error("[pwrui] Material symbols font generation failed:", error);
    return "";
  }
};

export function pwruiVitePlugin({ srcDir, extraIcons }: { srcDir?: string, extraIcons?: IconType[] } = {}): Plugin {
  let isSSR = false;

  return {
    name: "pwrui",
    enforce: "pre",
    configResolved: config => {
      isSSR = !!config.build.ssr;
    },
    resolveId: id => id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : null,
    load: async id => {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        if (isSSR) {
          return `/* [pwrui] Skipped material symbols font injection in server-side compilation pass */`;
        }

        if (!globalFontPromise) {
          globalFontPromise = fetchFontDataUri(srcDir || "app", extraIcons || []);
        }

        const base64 = await globalFontPromise;

        if (!base64) {
          return `/* [pwrui] No material symbols usage found or generation failed */`;
        }

        return `
          @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 400;
            src: url('data:font/woff2;charset=utf-8;base64,${base64}') format('woff2');
          }

          .material-symbols-outlined {
            font-size: 24px;
            font-family: "Material Symbols Outlined";
            font-weight: normal;
            font-style: normal;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            vertical-align: middle;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-feature-settings: "liga";
          }
        `;
      }
      return null;
    }
  };
}