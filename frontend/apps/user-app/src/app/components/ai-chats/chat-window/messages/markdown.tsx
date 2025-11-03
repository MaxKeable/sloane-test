import React, { useMemo, useCallback, useEffect, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useTheme } from "../../../../../context/theme-context";

interface IMarkdownProps {
  data: string;
  markdownClassesProps?: string;
  themeOverride?: "light" | "dark";
}

type ThemeType = "light" | "dark";

interface ComponentProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

// PlainTextCopy wrapper component
const PlainTextCopy: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (e.clipboardData) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          e.preventDefault();

          // Get the selected content with formatting
          const range = selection.getRangeAt(0);
          const container = document.createElement("div");
          container.appendChild(range.cloneContents());

          // Remove color styles but preserve table structure
          const elements = container.getElementsByTagName("*");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;

            // Reset colors to black/transparent
            el.style.removeProperty("color");
            el.style.removeProperty("background-color");

            // Preserve table structure with black borders
            if (el.tagName === "TABLE") {
              el.style.borderCollapse = "collapse";
              el.style.width = "100%";
            }
            if (["TABLE", "TH", "TD"].includes(el.tagName)) {
              el.style.border = "1px solid black";
              el.style.padding = "8px";
            }
            if (el.tagName === "TH") {
              el.style.fontWeight = "bold";
            }

            // Remove Tailwind color classes
            el.classList.forEach((className) => {
              if (
                className.includes("text-") ||
                className.includes("bg-") ||
                className.includes("border-")
              ) {
                el.classList.remove(className);
              }
            });
          }

          // Set both HTML (for formatting) and plain text (as fallback)
          e.clipboardData.setData("text/html", container.innerHTML);
          e.clipboardData.setData("text/plain", selection.toString());
        }
      }
    };

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, []);

  return (
    <div className="plain-text-copy selection:bg-blue-300">{children}</div>
  );
};

const MarkdownComponent: React.FC<IMarkdownProps> = React.memo(
  ({ data, markdownClassesProps, themeOverride }) => {
    let currentTheme: ThemeType = themeOverride || "light";

    try {
      const themeContext = useTheme();
      if (!themeOverride && themeContext?.theme) {
        currentTheme = themeContext.theme as ThemeType;
      }
    } catch (error) {
      // Fail gracefully outside ThemeContext
    }

    const H1 = useCallback(
      (props: ComponentProps) => (
        <h1 className="text-4xl font-semibold select-text mb-4" {...props}>
          {props.children}
        </h1>
      ),
      []
    );

    const H2 = useCallback(
      (props: ComponentProps) => (
        <h2 className="text-2xl font-semibold select-text mb-3" {...props}>
          {props.children}
        </h2>
      ),
      []
    );

    const H3 = useCallback(
      (props: ComponentProps) => (
        <h3 className="text-xl font-bold select-text mb-2" {...props}>
          {props.children}
        </h3>
      ),
      []
    );

    const H4 = useCallback(
      (props: ComponentProps) => (
        <h4 className="text-lg font-bold underline select-text mb-2" {...props}>
          {props.children}
        </h4>
      ),
      []
    );

    const H5 = useCallback(
      (props: ComponentProps) => (
        <h5
          className="text-base font-bold underline select-text mb-2"
          {...props}
        >
          {props.children}
        </h5>
      ),
      []
    );

    const P = useCallback(
      (props: ComponentProps) => (
        <p className="text-base font-light mb-4 select-text" {...props} />
      ),
      []
    );

    const Ul = useCallback(
      (props: ComponentProps) => (
        <ul className="list-disc ml-6 mb-4 select-text" {...props} />
      ),
      []
    );

    const Li = useCallback(
      (props: ComponentProps) => <li className="py-1 select-text" {...props} />,
      []
    );

    const Hr = useCallback(
      (props: ComponentProps) => (
        <hr
          className={`border-t my-4 ${
            currentTheme === "dark"
              ? "border-brand-cream/30"
              : "border-brand-green-dark/30"
          }`}
          {...props}
        />
      ),
      [currentTheme]
    );

    const Strong = useCallback(
      (props: ComponentProps) => (
        <strong className="font-semibold select-text" {...props} />
      ),
      []
    );

    const Em = useCallback(
      (props: ComponentProps) => (
        <em className="italic select-text" {...props} />
      ),
      []
    );

    const Del = useCallback(
      (props: ComponentProps) => (
        <del className="line-through select-text" {...props} />
      ),
      []
    );

    const Table = useCallback(
      (props: ComponentProps) => (
        <div
          className={`overflow-auto rounded-lg mb-6 ${
            currentTheme === "dark"
              ? "bg-brand-cream/50"
              : "bg-brand-green-dark/50"
          }`}
        >
          <table
            className={`w-full border-collapse select-text text-sm ${
              currentTheme === "dark"
                ? "border border-brand-cream/50 bg-brand-green"
                : "border border-brand-green-dark/50 bg-brand-cream"
            }`}
            {...props}
          />
        </div>
      ),
      [currentTheme]
    );

    const Thead = useCallback(
      (props: ComponentProps) => (
        <thead
          className={`select-text ${
            currentTheme === "dark" ? "bg-brand-cream/10" : "bg-brand-cream/20"
          }`}
          {...props}
        />
      ),
      [currentTheme]
    );

    const Th = useCallback(
      (props: ComponentProps) => (
        <th
          className={`px-4 py-2 text-left font-semibold select-text ${
            currentTheme === "dark"
              ? "text-brand-cream border border-brand-cream/50"
              : "text-brand-green-dark border border-brand-green-dark/50"
          }`}
          {...props}
        />
      ),
      [currentTheme]
    );

    const Tbody = useCallback(
      (props: ComponentProps) => (
        <tbody
          className={`select-text ${
            currentTheme === "dark"
              ? "divide-y divide-brand-cream/50"
              : "divide-y divide-brand-green-dark/50"
          }`}
          {...props}
        />
      ),
      [currentTheme]
    );

    const Td = useCallback(
      (props: ComponentProps) => (
        <td
          className={`px-4 py-2 select-text ${
            currentTheme === "dark"
              ? "text-brand-cream/90 border border-brand-cream/50"
              : "text-brand-green-dark/80 border border-brand-green-dark/50"
          }`}
          {...props}
        />
      ),
      [currentTheme]
    );

    const Pre = useCallback((props: ComponentProps) => {
      const [copied, setCopied] = useState(false);

      const extractTextContent = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(extractTextContent).join("");
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          if (props.children) {
            return extractTextContent(props.children);
          }
        }
        return "";
      };

      const handleCopy = async () => {
        const codeText = extractTextContent(props.children);
        try {
          await navigator.clipboard.writeText(codeText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy text:", err);
        }
      };

      return (
        <div className="relative group mb-4">
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-3 py-1 text-xs font-medium rounded-md transition-all opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            type="button"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre
            className="bg-black/30 text-white text-sm p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words select-text"
            {...props}
          />
        </div>
      );
    }, []);

    const Code = useCallback(
      (props: ComponentProps & { inline?: boolean }) => (
        <code
          className={`font-mono text-sm px-1 ${
            props.inline ? "bg-gray-100 text-black rounded select-text" : ""
          }`}
          {...props}
        >
          {props.children}
        </code>
      ),
      []
    );

    const markdownRenderers: Components = useMemo(
      () => ({
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        h5: H5,
        p: P,
        ul: Ul,
        li: Li,
        hr: Hr,
        strong: Strong,
        em: Em,
        del: Del,
        table: Table,
        thead: Thead,
        th: Th,
        tbody: Tbody,
        td: Td,
        pre: Pre,
        code: Code,
      }),
      [
        H1,
        H2,
        H3,
        H4,
        H5,
        P,
        Ul,
        Li,
        Hr,
        Strong,
        Em,
        Del,
        Table,
        Thead,
        Th,
        Tbody,
        Td,
        Pre,
        Code,
      ]
    );

    const markdownClasses = useMemo(
      () => (currentTheme === "dark" ? "text-brand-cream" : "text-brand-green"),
      [currentTheme]
    );

    return (
      <PlainTextCopy>
        <div
          className={`select-text ${markdownClassesProps || markdownClasses}`}
        >
          <ReactMarkdown
            components={markdownRenderers}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {data}
          </ReactMarkdown>
        </div>
      </PlainTextCopy>
    );
  }
);

export { MarkdownComponent as Markdown };
