import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { config } from "../config";
import type { Connector, PlatformApiResponse, PlatformData } from "./types";

interface PlatformContextType {
  data: PlatformData | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  // State for filtering (multi-select arrays)
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  platformFilters: string[];
  togglePlatformFilter: (filter: string) => void;
  functionFilters: string[];
  toggleFunctionFilter: (filter: string) => void;
  integrationFilters: string[];
  toggleIntegrationFilter: (filter: string) => void;
  resetFilters: () => void;
  // Derived data
  filteredConnectors: Connector[];
}

export const PlatformContext = createContext<PlatformContextType | undefined>(
  undefined,
);

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Filtering state (multi-select arrays)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [platformFilters, setPlatformFilters] = useState<string[]>([]);
  const [functionFilters, setFunctionFilters] = useState<string[]>([]);
  const [integrationFilters, setIntegrationFilters] = useState<string[]>([]);

  const togglePlatformFilter = (filter: string) => {
    setPlatformFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const toggleFunctionFilter = (filter: string) => {
    setFunctionFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const toggleIntegrationFilter = (filter: string) => {
    setIntegrationFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const resetFilters = () => {
    setPlatformFilters([]);
    setFunctionFilters([]);
    setIntegrationFilters([]);
    setSearchTerm("");
  };

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.platformApi);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch platform data: ${response.statusText}`,
        );
      }
      const json: PlatformApiResponse = await response.json();
      // Map API response structure to internal data structure
      setData({
        connectors: json.response.platforms,
        categories: json.response.categories,
      });
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const getFilteredConnectors = () => {
    if (!data?.connectors) return [];

    const search = searchTerm.toLowerCase();
    return data.connectors.filter((connector) => {
      const matchesSearch =
        connector.name.toLowerCase().includes(search) ||
        connector.dataType.toLowerCase().includes(search) ||
        connector.platformType.toLowerCase().includes(search);

      const matchesPlatform =
        platformFilters.length === 0 ||
        platformFilters.some(
          (f) => f.toLowerCase() === connector.platformType?.toLowerCase(),
        );
      const matchesFunction =
        functionFilters.length === 0 ||
        functionFilters.some(
          (f) => f.toLowerCase() === connector.dataTypeCategory?.toLowerCase(),
        );
      const matchesIntegration =
        integrationFilters.length === 0 ||
        integrationFilters.some(
          (f) => f.toLowerCase() === connector.supportedType?.toLowerCase(),
        );

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesFunction &&
        matchesIntegration
      );
    });
  };

  const filteredConnectors = getFilteredConnectors();

  return (
    <PlatformContext.Provider
      value={{
        data,
        loading,
        error,
        refresh: fetchPlatformData,
        searchTerm,
        setSearchTerm,
        platformFilters,
        togglePlatformFilter,
        functionFilters,
        toggleFunctionFilter,
        integrationFilters,
        toggleIntegrationFilter,
        resetFilters,
        filteredConnectors,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

/**
 * Custom hook to consume the Platform data context
 */
export const usePlatform = () => {
  const context = useContext(PlatformContext);

  if (context === undefined) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }

  return context;
};

export default usePlatform;
