# dotUI

dotUI helps you quickly build a component library with a **unique style**.

![dotUI](https://dotui.org/images/thumbnail.png)

## How it works?

1. You can start by choosing or creating your style
2. Init the foundations

```bash
npx shadcn@latest init @dotui/{styleName}/base
```

3. Add any component

```bash
npx shadcn@latest add @dotui/{styleName}/button
```

<!-- CONTRIBUTING -->

## Requirements

- React 19
- Tailwind CSS 4.0
- Typescript

<!-- FAQ -->

## FAQ

### What's different from shadcn-ui

shadcn-ui gives you a starting point to create your component library, but this starting point is the same for everyone.<br/>
dotUI gives you a custom starting point based on the style you've chosen or created.

- We use react-aria-components instead of radix-ui.
- We use tailwind-variants instead of cva.
- The color system is based on 6 color scales (neutral, accent, warning, info, danger and success).
- All components offers the posssibility to use composition or not.

<!-- CONTRIBUTING -->

## Contributing

We’d love your contributions! See the [contribution guide](CONTRIBUTING.md) to share your ideas, refinements, and innovations.

Join our [Discord community](https://discord.gg/DXpj5V2fU8) to discuss and collaborate.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.
