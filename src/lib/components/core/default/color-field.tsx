import {
  ColorField as AriaColorField,
  type ColorFieldProps as AriaColorFieldProps,
} from "react-aria-components";

type ColorFieldProps = AriaColorFieldProps;
const ColorField = (props: ColorFieldProps) => {
  return <AriaColorField {...props}></AriaColorField>;
};

export { ColorField };
