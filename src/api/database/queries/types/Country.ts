/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Country
// ====================================================

export interface Country_country_cities_nodes {
  __typename: "City";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  countryId: any;
  createdAt: any;
  updatedAt: any;
}

export interface Country_country_cities {
  __typename: "CitiesConnection";
  /**
   * A list of `City` objects.
   */
  nodes: (Country_country_cities_nodes | null)[];
}

export interface Country_country {
  __typename: "Country";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  nodeId: string;
  id: any;
  name: string;
  code: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `City`.
   */
  cities: Country_country_cities;
}

export interface Country {
  country: Country_country | null;
}

export interface CountryVariables {
  id: any;
}
