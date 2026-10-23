# ![](src/pwrui.svg) pwrui

pwrui is a powerful, flexible, and easy-to-use library for building interactive [React](https://github.com/facebook/react) applications.  
Check out the [docs](https://pwrui.wipmate.de/) for an overview on the available components, assets, and configuration.

## Installation

Run one of the following commands to add pwrui to your project, depending on your package manager:

```bash
npm install pwrui
pnpm install pwrui
yarn add pwrui
```

## Usage

Refer to the [docs](https://pwrui.wipmate.de/) for complete usage instructions.

<details>
<summary><b>Quick Usage Instructions</b></summary>

Import the following stylesheets in your JS client entrypoint:
```js
import "pwrui/style.css";
import "pwrui/symbols-static.css";
```
Import pwrui colors and choose the primary color scheme in your SASS stylesheet:
```scss
@use "pwrui/color" as *;
:root {
  @include color-scheme("blue");
}
```
Use any of the pwrui components with `import { <Component> } from "pwrui";`:
- `<Card />` - Basic container element for visual grouping.
- `<Checkbox />` - Control element for checking/unchecking a single option.
- `<Button />` - Control element for triggering an action.
- `<Dropdown />` - Control element for selecting from a set of options.
- `<Icon />` - Symbol for providing visual cues.
- `<Spinner />` - Indicator of an ongoing process.
- `<ThemeSelector />` - Control element for switching between light and dark theme.
</details>