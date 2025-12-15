declare module "markdown-it-implicit-figures" {
  import type MarkdownIt from "markdown-it";

  interface ImplicitFiguresOptions {
    figcaption?: boolean;
    copyAttrs?: boolean | string;
    tabindex?: boolean;
    link?: boolean;
    dataType?: boolean;
    lazy?: boolean;
  }

  export default function implicitFigures(
    md: MarkdownIt,
    options?: ImplicitFiguresOptions
  ): void;
}
