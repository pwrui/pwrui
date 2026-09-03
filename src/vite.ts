import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import { Plugin } from "vite";
import { IconType } from "pwrui";

const CSS_URL_BASE = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const VIRTUAL_MODULE_ID = "pwrui/symbols-dynamic.css";
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID;

let globalFontPromise: Promise<string> | null = null;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoffMs = 1000): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const delay = backoffMs * Math.pow(2, attempt - 1);
        console.warn(
          `[pwrui] Fetch failed (${err instanceof Error ? err.message : String(err)}). Retrying (${attempt}/${retries}) in ${delay}ms...`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

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

  const cssRes = await fetchWithRetry(`${CSS_URL_BASE}&icon_names=${sorted.join(",")}`, {
    headers: { "User-Agent": UA }
  });

  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\(['"]woff2['"]\)/);
  if (!match) {
    throw new Error("No woff2 URL found in retrieved Google Fonts CSS.");
  }

  const fontRes = await fetchWithRetry(match[1]);
  const fontBuffer = await fontRes.arrayBuffer();
  return Buffer.from(fontBuffer).toString("base64");
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

        try {
          const base64 = await globalFontPromise;

          if (!base64) {
            return `/* [pwrui] No material symbols usage found */`;
          }

          return `
          @font-face {
            font-family: 'Material Symbols Outlined';
            font-style: normal;
            font-weight: 400;
            src: url('data:font/woff2;charset=utf-8;base64,${base64}') format('woff2');
          }

          .material-symbols-outlined {
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
        } catch (error) {
          globalFontPromise = null;
          throw new Error(`[pwrui] Material symbols font generation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      return null;
    }
  };
}