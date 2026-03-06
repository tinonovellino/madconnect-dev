export type SupportedType = "SOURCE" | "DESTINATION";

export type PlatformType =
  | "Cloud Storage Provider"
  | "Data Provider"
  | "Media Management System"
  | "Demand-Side Platform (DSP)"
  | "Social Media Platform"
  | "Customer Data Platform (CDP)"
  | "CRM Platform"
  | "Supply-Side Platform (SSP)"
  | "Identity Management"
  | "E-Commerce Platform"
  | "Retail Media Platform"
  | "Media Measurement System";

export type DataTypeCategory =
  | "Events"
  | "Data Store"
  | "Audience Activation"
  | "Campaign Management"
  | "Identity Management"
  | "Reporting"
  | "audience activation"
  | "data store"
  | "events"
  | "reporting";

export interface Connector {
  platformType: string;
  id: string;
  name: string;
  dataType: string;
  dataTypeCategory: string;
  dataTypeId: string;
  connectorId: string;
  logo: string;
  overviewUrl: string;
  docUrl: string;
  status: number;
  supportedType: SupportedType;
  transfer: boolean;
  integrated: boolean;
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface PlatformData {
  connectors: Connector[];
  categories: Category[];
}

/**
 * Actual API response structure from https://app.madconnect.io/v2/platform
 */
export interface PlatformApiResponse {
  statusCode: number;
  statusMessage: string;
  response: {
    platforms: Connector[];
    categories: Category[];
  };
}
