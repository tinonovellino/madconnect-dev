import { LOGOS_BASE_URL } from "../../constants";
import type { Connector } from "../context/types";

interface ConnectorCardProps {
  connector: Connector;
  onClick?: (connector: Connector) => void;
}

export function ConnectorCard({ connector, onClick }: ConnectorCardProps) {
  const getLogoUrl = () => {
    if (connector.logo?.startsWith("http")) return connector.logo;
    return `${LOGOS_BASE_URL}/${connector.id}.svg`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick(connector);
    }
  };

  return (
    <div className="connector-single" onClick={handleClick}>
      <div className="integration-type-label">
        {connector.supportedType === "SOURCE" ? "Source" : "Destination"}
      </div>
      <div className="connector-company">
        <div className="logo">
          <img src={getLogoUrl()} alt={connector.name} loading="lazy" />
        </div>
        <div className="name">{connector.name}</div>
      </div>
      <div className="functionality-type-label">{connector.dataType}</div>
    </div>
  );
}

export default ConnectorCard;
