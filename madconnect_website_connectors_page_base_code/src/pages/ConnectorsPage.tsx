import { useNavigate } from "react-router-dom";
import { LOGOS_BASE_URL } from "../../constants";
import { ConnectorCard } from "../components/ConnectorCard";
import { FiltersPanel } from "../components/FiltersPanel";
import { Layout } from "../components/Layout";
import { SearchBox } from "../components/SearchBox";
import { usePlatform } from "../context/PlatformContext";
import type { Connector } from "../context/types";
import { extractSlugFromOverviewUrl } from "../hooks/useFetchConnectorDoc";

export function ConnectorsPage() {
  const navigate = useNavigate();
  const {
    data,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    platformFilters,
    togglePlatformFilter,
    functionFilters,
    toggleFunctionFilter,
    integrationFilters,
    toggleIntegrationFilter,
    resetFilters,
    refresh,
    filteredConnectors,
  } = usePlatform();

  const getLogoUrl = (connector: Connector) => {
    if (connector.logo?.startsWith("http")) return connector.logo;
    return `${LOGOS_BASE_URL}/${connector.id}.svg`;
  };

  const handleCardClick = (connector: Connector) => {
    const slug = extractSlugFromOverviewUrl(connector.overviewUrl);
    if (slug) {
      navigate(`/connector/${slug}`, {
        state: {
          connectorId: connector.id,
          connectorName: connector.name,
          dataType: connector.dataType,
          logoUrl: getLogoUrl(connector),
        },
      });
    }
  };

  const platformTypes = data?.categories?.[0]?.subCategories
    ? data.categories[0].subCategories.map((sub) => sub.name)
    : [];

  const functionalityTypes = data?.categories?.[1]?.subCategories
    ? data.categories[1].subCategories.map((sub) => sub.name)
    : [];

  const integrationTypes = data?.categories?.[2]?.subCategories
    ? data.categories[2].subCategories.map((sub) => sub.name)
    : ["Source", "Destination"];

  const handleIntegrationToggle = (value: string) => {
    const mapped = value.toUpperCase() === "SOURCE" ? "SOURCE" : "DESTINATION";
    toggleIntegrationFilter(mapped);
  };

  const getIntegrationDisplayValues = () => {
    return integrationFilters.map((f) =>
      f === "SOURCE" ? "Source" : "Destination",
    );
  };

  const filterSections = [
    {
      title: "Platform Type",
      options: platformTypes,
      selectedValues: platformFilters,
      onToggle: togglePlatformFilter,
    },
    {
      title: "Functionality",
      options: functionalityTypes,
      selectedValues: functionFilters,
      onToggle: toggleFunctionFilter,
    },
    {
      title: "Integration Type",
      options: integrationTypes,
      selectedValues: getIntegrationDisplayValues(),
      onToggle: handleIntegrationToggle,
    },
  ];

  return (
    <Layout title="Live Connectors" subtitle="Available On-Demand">
      <div className="section-container bright connectors">
        <div className="connectors-container">
          <a href="#rac-modal" className="request-a-connector-button standard-cta-button">
            Request a Connector
          </a>    
          {/* <!-- RAC MODAL --> */}
          <div id="rac-modal" className="modal-window">
              <a href="#" className="modal-backdrop"></a>
              <div className="modal">
                  <a href="#" title="Close" className="modal-close"></a>
                  <div className="modal-title black">
                      Request a Connector
                  </div>
                  <div className="modal-desc">
                      Some copy here
                  </div>
                  <div className="modal-form">
                      Form here
                  </div>
              </div>
          </div> 
          <FiltersPanel sections={filterSections} onReset={resetFilters} />

          <div className="main-wrapper">
            <SearchBox
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search for a Connector"
            />

            <div className="connector-items-container">
              {filteredConnectors.map((connector, index) => (
                <ConnectorCard
                  key={`${connector.id}-${index}`}
                  connector={connector}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {loading && (
              <div className="loading-state">Loading connectors...</div>
            )}

            {error && !loading && (
              <div className="error-state">
                Error loading connectors.
                <div className="error-message">{error.message}</div>
                <button
                  type="button"
                  className="retry-button"
                  onClick={refresh}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredConnectors.length === 0 && (
              <div className="empty-state">
                No connectors found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ConnectorsPage;
