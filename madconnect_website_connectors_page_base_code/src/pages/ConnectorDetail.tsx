import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LOGOS_BASE_URL } from "../../constants";
import { DocumentRenderer } from "../components/DocumentRenderer";
import { Layout } from "../components/Layout";
import { useFetchConnectorDoc } from "../hooks/useFetchConnectorDoc";

interface ConnectorState {
  connectorId: string;
  connectorName: string;
  dataType: string;
  logoUrl: string;
}

function isConnectorState(state: unknown): state is ConnectorState {
  return (
    typeof state === "object" &&
    state !== null &&
    "connectorId" in state &&
    "connectorName" in state &&
    "dataType" in state &&
    "logoUrl" in state
  );
}

function ConnectorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { markdown, loading, error } = useFetchConnectorDoc(slug ?? null);
  const connectorState = isConnectorState(location.state)
    ? location.state
    : null;

  const displayName = connectorState?.connectorName
    ? connectorState.connectorName
    : slug
      ? slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "Connector";

  const displayDataType = connectorState?.dataType ?? null;
  const logoUrl =
    connectorState?.logoUrl ||
    (connectorState?.connectorId
      ? `${LOGOS_BASE_URL}/${connectorState.connectorId}.svg`
      : null);

  return (
    <Layout title={displayName} subtitle={displayDataType ?? undefined}>
      <div className="detail-container">
        <div className="header-wrapper">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            ← Back to Connectors
          </button>

          <div className="detail-header" aria-label="Connector summary">
            {logoUrl && (
              <img
                className="detail-logo"
                src={logoUrl}
                alt={`${displayName} logo`}
                loading="lazy"
              />
            )}
            <div className="detail-title">
              <h1 className="detail-name">{displayName}</h1>
              {displayDataType && (
                <p className="detail-subtitle">{displayDataType}</p>
              )}
            </div>
          </div>
        </div>

        <div className="detail-content">
          <DocumentRenderer
            markdown={markdown}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ConnectorDetail;
