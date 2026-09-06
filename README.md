# ![](src/pwrui.svg) pwrui

pwrui is a powerful, flexible, and easy-to-use library for building interactive [React](https://github.com/facebook/react) applications.  
Check out the [demo page](https://pwrui.wipmate.de/) for an overview on the available components and assets.

## Installation

Run one of the following commands to add pwrui to your project, depending on your package manager:

```bash
npm install pwrui
pnpm install pwrui
yarn add pwrui
```

## Usage

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

The library currently provides the following components:

- `<Card />`
- `<Button />`
- `<Checkbox />`
- `<Dropdown />`
- `<Icon />`
- `<Spinner />`
- `<ThemeSelector />`

Icons in pwrui are based on the [Material Symbols](https://fonts.google.com/icons):

```jsx
import { Icon } from "pwrui";

<Icon smartphone />
```

Buttons in pwrui support action handlers with the included `onPress` attribute:

```jsx
import { Button } from "pwrui";

<Button onPress={() => doStuff()}>
  Do Stuff
</Button>
```