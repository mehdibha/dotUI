export interface RenderNode {
  name: string;
  props: string[];
  children: RenderChild[];
}

export type RenderChild = RenderNode | RenderText;

export interface RenderText {
  type: "text";
  value: string;
}

