# JS Framework

A JS framework written in TypeScript that allows rendering and dynamic updating of DOM elements based on a virtual DOM configuration object.

## Features

- Declarative HTML rendering using a config object
- Efficient DOM updates when the config changes
- Pure TypeScript implementation

## Quick Start

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser and wait 2 seconds to see dynamic changes.

## Example

```ts
const app = new JsFramework("#app");
app.render({
  tag: "div",
  props: {
    id: "wrapper",
    children: [{ tag: "p", props: { children: "Hello, World!" } }],
  },
});
```
