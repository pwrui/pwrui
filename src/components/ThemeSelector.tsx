import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button } from "./Button.js";
import { Icon } from "./Icon.js";

export function ThemeSelector({ label, theme }: { label?: FunctionComponent<{ targetTheme: "light" | "dark" }>, theme?: "light" | "dark" }): ReactElement {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const storedTheme = localStorage?.theme;
    setCurrentTheme(storedTheme ? (storedTheme as "light" | "dark") : getSystemTheme());

    const systemDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setCurrentTheme(getSystemTheme());
    };

    systemDarkModeQuery.addEventListener("change", handleChange);

    return () => {
      systemDarkModeQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  const targetTheme = theme ?? getInverseTheme(currentTheme);
  const Label = label ?? (({ targetTheme }) => <><Icon icon={`${targetTheme}_mode`} />View in {targetTheme} mode</>);

  return <Button onPress={() => setCurrentTheme(targetTheme)}>
    <Label targetTheme={targetTheme} />
  </Button>;
}

function getInverseTheme(theme: "light" | "dark") {
  return theme === "light" ? "dark" : "light";
}
function getSystemTheme() {
  return typeof window !== "undefined" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : "dark";
}
function setTheme(theme: "light" | "dark" | "system") {
  if (typeof localStorage !== "undefined") {
    switch (theme) {
      case "light":
      case "dark":
        localStorage.theme = theme;
        break;
      case "system":
        if (localStorage.theme) {
          localStorage.removeItem("theme");
        }
        theme = getSystemTheme();
        break;
      default:
        return;
    }
  }
  if (["light", "dark"].includes(theme) && typeof document !== "undefined") {
    for (let sheet_file = 0; sheet_file < document.styleSheets.length; ++sheet_file) {
      try {
        for (let sheet_rule = 0; sheet_rule < document.styleSheets[sheet_file].cssRules.length; ++sheet_rule) {
          let rule = document.styleSheets[sheet_file].cssRules[sheet_rule];

          if (rule && rule instanceof CSSMediaRule && rule.media.mediaText.includes("prefers-color-scheme")) {
            let rule_media = rule.media.mediaText;
            let new_rule_media = rule_media.replace(/\b(light|dark)\b/g, () => getSystemTheme() === "dark" ? theme : getInverseTheme(theme as "light" | "dark"));
            rule.media.deleteMedium(rule_media);
            rule.media.appendMedium(new_rule_media);
          }
        }
      } catch (error) {
        console.warn(`setting ${theme} theme failed in stylesheet ${document.styleSheets[sheet_file].href}: ${error}`);
      }
    }
  }
}