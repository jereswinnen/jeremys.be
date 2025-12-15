declare module "markdown-it-attrs" {
  import type MarkdownIt from "markdown-it";

  interface MarkdownItAttrsOptions {
    leftDelimiter?: string;
    rightDelimiter?: string;
    allowedAttributes?: string[];
  }

  export default function markdownItAttrs(
    md: MarkdownIt,
    options?: MarkdownItAttrsOptions
  ): void;
}
