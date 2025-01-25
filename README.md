# ⚡ pwrui

Still in its early stages, pwrui is intended to grow into a powerful, flexible, and easy-to-use library for building interactive [React](https://github.com/facebook/react) applications.  
While pwrui is best used in applications based on [React Router](https://github.com/remix-run/react-router) (framework), most of its assets and components can be used in any environment.

> [!WARNING]
> This project is work in progress.

## Installation

Run one of the following commands to add pwrui to your project, depending on your package manager:

```bash
npm install pwrui
pnpm install pwrui
yarn add pwrui
```

## Usage

Import the following stylesheet in your main JS file:

```js
import "pwrui/style.css";
```

The library currently provides the following components:

- `<Card />`
- `<Button />`
- `<Checkbox />`
- `<Dropdown />`
- `<Icon />`
- `<Spinner />`
- `<ThemeSelector />`

The following example shows how to use the [Material Symbols](https://fonts.google.com/icons) included in pwrui:

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