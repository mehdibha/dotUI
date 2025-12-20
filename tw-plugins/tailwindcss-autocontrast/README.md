# tailwindcss-autocontrast

Tailwind CSS plugin for automatic contrast color generation. Automatically generates high-contrast text colors (`on-*` variants) for your color scales.

## Features

- ✅ **Automatic contrast colors**: Generates `on-{color}-{shade}` CSS variables for optimal text contrast
- ✅ **WCAG compliant**: Calculates contrast ratios to ensure readable text
- ✅ **Modern color spaces**: Supports OKLCH, HSL, RGB, HEX, and more
- ✅ **Zero configuration**: Works out of the box with your existing color scales

## Installation

```bash
pnpm add tailwindcss-autocontrast
```

## Usage

Add the plugin to your CSS file:

```css
@import "tailwindcss";
@plugin "tailwindcss-autocontrast";
```

Define your color scales in CSS:

```css
:root {
  --accent-50: oklch(0.8706 0.0701 241.56);
  --accent-500: oklch(0.5 0.15 241);
  --accent-900: oklch(0.3 0.1 241);
}
```

The plugin automatically generates contrast colors:

```css
:root {
  /* Your colors */
  --accent-50: oklch(0.8706 0.0701 241.56);
  --accent-500: oklch(0.5 0.15 241);
  --accent-900: oklch(0.3 0.1 241);

  /* Auto-generated */
  --on-accent-50: black;
  --on-accent-500: white;
  --on-accent-900: white;
}
```

## Configuration

The plugin works by scanning your CSS files for color scales. You can configure the file location:

```js
@plugin "tailwindcss-autocontrast" {
  cssFile: "./styles/globals.css",
  source: ["./src/**/*.css"],
  logLevel: "warn"
}
```

### Options

- `cssFile` (string): Path to your root CSS file
- `source` (string | string[]): Directories or files to search for CSS
- `logLevel` ("warn" | "silent"): Control logging output

## How it Works

1. Scans your CSS files for color scale variables (e.g., `--accent-50`, `--danger-200`)
2. Parses color values (supports all modern formats including OKLCH)
3. Calculates luminance and contrast ratios
4. Generates optimal text colors (black or white) for maximum readability
5. Injects `--on-{color}-{shade}` variables into your CSS

## Testing

Run tests:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

## License

MIT
