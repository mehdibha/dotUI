# dotUI CLI

A CLI for adding components, hooks, themes and more to your project.

## Usage

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, configures `tailwind.config.js`, and CSS variables for the project.

```bash
npx dotui-cli init
```

## add

Use the `add` command to add components to your project.

The `add` command adds a component to your project and installs all required dependencies.

```bash
npx dotui-cli add [component]
```

### Example

```bash
npx dotui-cli add alert
```

You can also run the command without any arguments to view a list of all available components:

```bash
npx dotui-cli add
```

## Documentation

Visit https://dotui.org/docs/cli to view the documentation.

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
