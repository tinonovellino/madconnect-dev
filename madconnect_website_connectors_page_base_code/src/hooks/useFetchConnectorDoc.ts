import { useCallback, useEffect, useState } from "react";
import { DOCS_BASE_URL } from "../../constants";

interface UseFetchConnectorDocResult {
  markdown: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Extract the slug from an overviewUrl
 * Example: "/v1/document?path=meta-facebook-ads-audience" -> "meta-facebook-ads-audience"
 */
export const extractSlugFromOverviewUrl = (
  overviewUrl: string,
): string | null => {
  if (!overviewUrl) return null;

  // Handle query param format: /v1/document?path=slug
  const match = overviewUrl.match(/[?&]path=([^&]+)/);
  if (match) return match[1];

  // Handle direct path format: /path/to/slug
  const parts = overviewUrl.split("/").filter(Boolean);
  return parts[parts.length - 1] || null;
};

/**
 * Build the full S3 URL for a connector's documentation
 */
export const buildDocsUrl = (slug: string): string => {
  return `${DOCS_BASE_URL}/${slug}.md`;
};

/**
 * Hook to fetch connector documentation markdown from S3
 */
export const useFetchConnectorDoc = (
  slug: string | null,
): UseFetchConnectorDocResult => {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDoc = useCallback(async () => {
    if (!slug) {
      setMarkdown(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = buildDocsUrl(slug);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch documentation: ${response.statusText}`,
        );
      }

      const text = await response.text();
      setMarkdown(text);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch documentation"),
      );
      setMarkdown(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDoc();
  }, [fetchDoc]);

  return {
    markdown,
    loading,
    error,
    refetch: fetchDoc,
  };
};

export default useFetchConnectorDoc;
