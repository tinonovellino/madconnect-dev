import Markdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface DocumentRendererProps {
  markdown: string | null;
  loading: boolean;
  error: Error | null;
}

// GitHub raw URL for assets
const GITHUB_ASSETS_URL =
  "https://raw.githubusercontent.com/ops-madtech/madconnect-docs/main";

// Allowed domains for external image URLs
const ALLOWED_IMAGE_DOMAINS = [
  "madconnect.io",
  "app.madconnect.io",
  "raw.githubusercontent.com",
  "madconnect-docs.s3.amazonaws.com",
];

const isAllowedImageDomain = (url: string): boolean => {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_IMAGE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
};

const transformImageUrl = (src: string | undefined): string => {
  if (!src) return "";
  if (src.startsWith("http")) {
    return isAllowedImageDomain(src) ? src : "";
  }
  let cleanSrc = src.replace(/^<|>$/g, "").trim();
  if (!cleanSrc.startsWith(".gitbook") && !cleanSrc.startsWith("/")) {
    cleanSrc = `.gitbook/assets/${cleanSrc}`;
  }
  const encodedPath = cleanSrc
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${GITHUB_ASSETS_URL}/${encodedPath}`;
};

// Check if string looks like JSON
const looksLikeJson = (str: string): boolean => {
  const trimmed = str.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
};

// Format JSON with proper indentation
const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
};

// Convert GitBook table-embedded code to proper code blocks
// Pattern: | <p><code>...</code></p><p><code>...</code></p>... |
const convertGitbookTableCode = (md: string): string => {
  const lines = md.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line is a table row with <p><code> pattern
    if (
      line.startsWith("|") &&
      line.includes("<p>") &&
      line.includes("<code>")
    ) {
      // Extract all code content from <code> tags
      const codeMatches = line.match(/<code>([^<]*)<\/code>/g);

      if (codeMatches && codeMatches.length > 0) {
        const codeContent = codeMatches
          .map((code) => code.replace(/<\/?code>/g, ""))
          .join("\n");

        // Skip the separator line (| --- |) if it follows
        if (i + 1 < lines.length && /^\|\s*[-:]+\s*\|/.test(lines[i + 1])) {
          i++;
        }

        // Determine language and format
        if (looksLikeJson(codeContent)) {
          const formatted = formatJson(codeContent);
          result.push(`\n\`\`\`json\n${formatted}\n\`\`\`\n`);
        } else {
          result.push(`\n\`\`\`\n${codeContent}\n\`\`\`\n`);
        }
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
    i++;
  }

  return result.join("\n");
};

export const preprocessMarkdown = (md: string): string => {
  let result = md;

  // First, convert GitBook table-embedded code to proper code blocks
  result = convertGitbookTableCode(result);

  // Format ALL code blocks - detect JSON by content, not by header
  result = result.replace(
    /```(\w*)\s*([\s\S]*?)```/g,
    (match, _lang, content) => {
      const trimmedContent = content.trim();
      // If it looks like JSON (regardless of language tag), format it
      if (looksLikeJson(trimmedContent)) {
        const formatted = formatJson(trimmedContent);
        // Only change if formatting was successful (different from original)
        if (formatted !== trimmedContent) {
          return `\`\`\`json\n${formatted}\n\`\`\``;
        }
      }
      return match;
    },
  );

  result = result.replace(/!\[([^\]]*)\]\(<([^>]+)>\)/g, (_, alt, path) => {
    const fullUrl = transformImageUrl(path);
    return `![${alt}](${fullUrl})`;
  });

  // Convert <img> HTML tags with .gitbook URLs to markdown image syntax
  // (rehype-sanitize does not parse raw HTML, so we use markdown instead)
  result = result.replace(
    /<img\s+[^>]*?src=["']([^"']+\.gitbook[^"']+)["'][^>]*>/gi,
    (_, src) => {
      const fullUrl = transformImageUrl(src);
      return fullUrl ? `![](${fullUrl})` : "";
    },
  );

  return result;
};

export function DocumentRenderer({
  markdown,
  loading,
  error,
}: DocumentRendererProps) {
  if (loading) {
    return <div className="md-loading">Loading documentation...</div>;
  }

  if (error) {
    return (
      <div className="md-error">
        <p>Failed to load documentation.</p>
        <p className="md-error-message">{error.message}</p>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="md-empty">
        No documentation available for this connector.
      </div>
    );
  }

  const processedMarkdown = preprocessMarkdown(markdown);

  return (
    <article className="md-content">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, defaultSchema]]}
        components={{
          h1: ({ children }) => <h1 className="md-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="md-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="md-h3">{children}</h3>,
          h4: ({ children }) => <h4 className="md-h4">{children}</h4>,
          h5: ({ children }) => <h5 className="md-h5">{children}</h5>,
          h6: ({ children }) => <h6 className="md-h6">{children}</h6>,
          p: ({ children }) => <p className="md-p">{children}</p>,
          ul: ({ children }) => <ul className="md-ul">{children}</ul>,
          ol: ({ children }) => <ol className="md-ol">{children}</ol>,
          li: ({ children }) => <li className="md-li">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="md-blockquote">{children}</blockquote>
          ),
          code: ({ children, className }) => (
            <code className={`md-code ${className || ""}`}>{children}</code>
          ),
          pre: ({ children }) => <pre className="md-pre">{children}</pre>,
          table: ({ children }) => (
            <table className="md-table">{children}</table>
          ),
          thead: ({ children }) => (
            <thead className="md-thead">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="md-tbody">{children}</tbody>
          ),
          tr: ({ children }) => <tr className="md-tr">{children}</tr>,
          th: ({ children }) => <th className="md-th">{children}</th>,
          td: ({ children }) => <td className="md-td">{children}</td>,
          a: ({ children, href }) => (
            <a
              className="md-a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => {
            const finalSrc = transformImageUrl(src);
            return (
              <img
                className="md-img"
                src={finalSrc}
                alt={alt || ""}
                loading="lazy"
                {...props}
              />
            );
          },
          hr: () => <hr className="md-hr" />,
          strong: ({ children }) => (
            <strong className="md-strong">{children}</strong>
          ),
          em: ({ children }) => <em className="md-em">{children}</em>,
        }}
      >
        {processedMarkdown}
      </Markdown>
    </article>
  );
}

export default DocumentRenderer;
