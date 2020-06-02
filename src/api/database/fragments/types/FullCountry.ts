/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: FullCountry
// ====================================================

export interface FullCountry_cities_nodes {
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

export interface FullCountry_cities {
  __typename: "CitiesConnection";
  /**
   * A list of `City` objects.
   */
  nodes: (FullCountry_cities_nodes | null)[];
}

export interface FullCountry {
  __typename: "Country";
  id: any;
  name: string;
  code: string;
  createdAt: any;
  updatedAt: any;
  /**
   * Reads and enables pagination through a set of `City`.
   */
  cities: FullCountry_cities;
}
